import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types.js';

export const prerender = false;

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// hooks.server.ts already validated the session (getUser) for every request.
	if (!locals.session) {
		const next = encodeURIComponent(url.pathname + url.search);
		throw redirect(303, `/login?redirectTo=${next}`);
	}
	return {};
};
