import { env } from '$env/dynamic/private';
import { GithubCalendarSchema, type GithubCalendar } from '$lib/data/github';
import {
	mapCertificateToCertification,
	mapRowToCertificate,
	type Certification
} from '$lib/schema/certificate';
import type { GuestbookEntry } from '$lib/schema/guestbook';
import { createStaticClient } from '$lib/supabase/static';
import type { PageServerLoad } from './$types';

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

async function fetchGithub(
	username: string,
	token: string | undefined
): Promise<GithubCalendar | null> {
	if (!token) return null;
	try {
		const response = await fetch(GITHUB_USER_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `bearer ${token}`
			},
			body: JSON.stringify({ query: GITHUB_USER_QUERY, variables: { username } })
		});
		const payload = await response.json();
		if (payload?.errors?.length || response.status > 400) {
			console.warn(`[github] load fallback status=${response.status}`);
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

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=30, s-maxage=300' });

	const token = env.GH_READ_USER_TOKEN_PERSONAL;
	const username = env.GITHUB_USERNAME ?? 'SerenaaaaRN';
	const supabase = createStaticClient();

	const [github, certifications, guestbook] = await Promise.all([
		fetchGithub(username, token),
		loadCertifications(supabase),
		loadGuestbook(supabase)
	]);

	return { github, certifications, guestbook };
};
