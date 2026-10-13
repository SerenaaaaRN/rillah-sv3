import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { GithubCalendarSchema, type GithubCalendar } from '$lib/data/github';
import {
	mapCertificateToCertification,
	mapRowToCertificate,
	type Certification
} from '$lib/schema/certificate';
import { validateGuestbook, type GuestbookEntry } from '$lib/schema/guestbook';
import { createStaticClient } from '$lib/supabase/static';
import {
	CERTIFICATES_SELECT,
	CERTIFICATES_TABLE,
	REVIEWS_SELECT,
	REVIEWS_TABLE
} from '$lib/supabase/types.js';
import { formDataToRecord } from '$lib/utils/form.js';
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
		.from(CERTIFICATES_TABLE)
		.select(CERTIFICATES_SELECT)
		.order('display_order', { ascending: true });
	if (error) {
		console.error('[landing] loadCertifications failed:', error.message);
		return [];
	}
	return (data ?? []).map(mapRowToCertificate).map(mapCertificateToCertification);
}

async function loadGuestbook(supabase: SupabaseClient): Promise<GuestbookEntry[]> {
	const { data, error } = await supabase
		.from(REVIEWS_TABLE)
		.select(REVIEWS_SELECT)
		.order('created_at', { ascending: false });
	if (error) {
		console.warn('[landing] loadGuestbook failed:', error.message);
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

	const github = fetchGithubCached(username, token);
	const [certifications, guestbook] = await Promise.all([
		loadCertifications(supabase),
		loadGuestbook(supabase)
	]);

	return { github, certifications, guestbook };
};

export const actions: Actions = {
	guestbook: async ({ request }) => {
		const record = formDataToRecord(await request.formData());

		if (record.website) return fail(400, { error: 'Spam detected' });

		const { data, error: validationError } = validateGuestbook({
			name: record.name?.trim(),
			message: record.message?.trim()
		});
		if (!data) return fail(400, { error: validationError ?? 'Invalid input' });

		const { error } = await createStaticClient()
			.from(REVIEWS_TABLE)
			.insert({ name: data.name, message: data.message });
		if (error) return fail(500, { error: error.message || 'Failed to post message' });

		return { success: true };
	}
};
