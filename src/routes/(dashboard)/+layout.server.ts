import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const { session } = await locals.safeGetSession();
	if (!session) {
		const next = encodeURIComponent(url.pathname + url.search);
		throw redirect(303, `/login?redirectTo=${next}`);
	}
	return {};
};
