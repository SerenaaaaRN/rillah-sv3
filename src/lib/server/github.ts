import { GH_READ_USER_TOKEN_PERSONAL, GITHUB_USERNAME } from '$app/env/private';
import { GithubCalendarSchema, type GithubCalendar } from '#lib/data/github.js';

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

const GITHUB_TTL_MS = 6 * 60 * 60 * 1000;

let githubCache: { at: number; data: GithubCalendar | null } | null = null;

const GITHUB_TIMEOUT_MS = 10_000;

async function fetchGithub(username: string, token: string): Promise<GithubCalendar | null> {
	try {
		const response = await fetch(GITHUB_USER_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'rillah-sv3',
				Accept: 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2022-11-28',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ query: GITHUB_USER_QUERY, variables: { username } }),
			signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS)
		});
		if (!response.ok) {
			console.warn(`[github] load fallback status=${response.status}`);
			return null;
		}
		const payload = await response.json();
		if (payload?.errors?.length) {
			console.warn(`[github] load fallback errors=${JSON.stringify(payload.errors)}`);
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

/** GitHub contribution calendar with a 6h in-memory cache. Returns null on any failure (never throws). */
export async function fetchGithubCalendar(): Promise<GithubCalendar | null> {
	const token = GH_READ_USER_TOKEN_PERSONAL?.trim();
	if (!token) {
		console.warn('[github] load fallback error=missing_token');
		return null;
	}
	const username = GITHUB_USERNAME?.trim() || 'SerenaaaaRN';

	const now = Date.now();
	if (githubCache && now - githubCache.at < GITHUB_TTL_MS) return githubCache.data;

	const data = await fetchGithub(username, token);
	if (data) githubCache = { at: now, data };
	return data;
}
