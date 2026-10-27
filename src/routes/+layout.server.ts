import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	return {
		session: locals.session,
		user: locals.user,
		cookies: cookies.getAll().filter((c) => c.name.startsWith('sb-'))
	};
};
