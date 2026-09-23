import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { GithubCalendarSchema, type GithubCalendar } from '$lib/data/github';
import {
	mapCertificateToCertification,
	mapRowToCertificate,
	type Certification
} from '$lib/schema/certificate';
import { GuestbookSchema, type GuestbookEntry } from '$lib/schema/guestbook';
import { createStaticClient } from '$lib/supabase/static';
import type { Actions, PageServerLoad } from './$types';

const GITHUB_USER_ENDPOINT = 'https://api.github.com/graphql';
const GITHUB_USER_QUERY = `query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        colors
        totalContributions
        months { firstDay name totalWeeks }
        weeks { contributionDays { color contributionCount date } firstDay }
      }
    }
  }
}`;

type SupabaseClient = ReturnType<typeof createStaticClient>;

const GITHUB_TTL_MS = 6 * 60 * 60 * 1000;
let githubCache: { at: number; data: GithubCalendar | null } | null = null;

async function fetchGithubCached(
	username: string,
	token: string | undefined
): Promise<GithubCalendar | null> {
	if (!token) {
		console.warn('[github] load fallback error=missing_token');
		return null;
	}
	const now = Date.now();
	if (githubCache && now - githubCache.at < GITHUB_TTL_MS) return githubCache.data;
	const data = await fetchGithub(username, token);
	if (data) githubCache = { at: now, data };
	return data;
}

async function fetchGithub(
	username: string,
	token: string | undefined
): Promise<GithubCalendar | null> {
	if (!token) {
		console.warn('[github] load fallback error=missing_token');
		return null;
	}
	try {
		const response = await fetch(GITHUB_USER_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'rillah-sv3',
				Accept: 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2022-11-28',
				Authorization: `Bearer ${token.trim()}`
			},
			body: JSON.stringify({ query: GITHUB_USER_QUERY, variables: { username } })
		});
		const payload = await response.json();
		if (payload?.errors?.length || !response.ok) {
			console.warn(
				`[github] load fallback status=${response.status} errors=${JSON.stringify(payload?.errors ?? payload)}`
			);
			return null;
		}
		const parsed = GithubCalendarSchema.safeParse(
			payload?.data?.user?.contributionsCollection?.contributionCalendar
		);
		if (!parsed.success) {
			console.warn('[github] load fallback error=invalid_payload');
			return null;
		}
		return parsed.data;
	} catch (e) {
		console.warn(`[github] load exception error=${e instanceof Error ? e.message : String(e)}`);
		return null;
	}
}

async function loadCertifications(supabase: SupabaseClient): Promise<Certification[]> {
	const { data, error } = await supabase
		.from('certificates')
		.select('*')
		.order('display_order', { ascending: true });
	if (error) {
		console.error('loadCertifications error', error.message);
		return [];
	}
	return (data ?? []).map(mapRowToCertificate).map(mapCertificateToCertification);
}

async function loadGuestbook(supabase: SupabaseClient): Promise<GuestbookEntry[]> {
	const { data, error } = await supabase
		.from('reviews')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(20);
	if (error) {
		console.warn('loadGuestbook error', error.message);
		return [];
	}
	return (data ?? []).map((r) => ({
		id: String(r.id),
		name: String(r.name ?? ''),
		message: String(r.message ?? ''),
		created_at: String(r.created_at ?? '')
	}));
}

export const load: PageServerLoad = async ({ platform }) => {
	const token =
		platform?.env?.GH_READ_USER_TOKEN_PERSONAL?.trim() ||
		env.GH_READ_USER_TOKEN_PERSONAL?.trim() ||
		undefined;
	const username =
		platform?.env?.GITHUB_USERNAME?.trim() || env.GITHUB_USERNAME?.trim() || 'SerenaaaaRN';
	const supabase = createStaticClient();

	const [github, certifications, guestbook] = await Promise.all([
		fetchGithubCached(username, token),
		loadCertifications(supabase),
		loadGuestbook(supabase)
	]);

	return {
		github,
		certifications,
		guestbook
	};
};

export const actions: Actions = {
	guestbook: async ({ request }) => {
		const formData = await request.formData();

		const honeypot = formData.get('website');
		if (honeypot) {
			return fail(400, { error: 'Spam detected' });
		}

		const raw = {
			name: formData.get('name')?.toString().trim(),
			message: formData.get('message')?.toString().trim()
		};

		const parsed = GuestbookSchema.safeParse(raw);
		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message ?? 'Invalid input'
			});
		}

		const supabase = createStaticClient();
		const { error } = await supabase.from('reviews').insert({
			name: parsed.data.name,
			message: parsed.data.message
		});

		if (error) {
			return fail(500, {
				error: error.message || 'Failed to post message'
			});
		}

		return { success: true };
	}
};
