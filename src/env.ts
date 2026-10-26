import { defineEnvVars } from '@sveltejs/kit/env';

// Private + public env vars for the app (see https://svelte.dev/docs/kit/environment-variables).
export const variables = defineEnvVars({
	GH_READ_USER_TOKEN_PERSONAL: { schema: (input) => input ?? '' },
	GITHUB_USERNAME: { schema: (input) => input ?? '' },
	PUBLIC_SUPABASE_PUBLISHABLE_KEY: { public: true, static: true },
	PUBLIC_SUPABASE_URL: { public: true, static: true }
});
