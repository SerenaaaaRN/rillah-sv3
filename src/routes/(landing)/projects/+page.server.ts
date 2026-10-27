import { getProjectCards } from '#lib/server/content.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders, depends }) => {
	depends('supabase:projects');
	setHeaders({ 'cache-control': 'public, max-age=30, s-maxage=300' });

	return { projects: await getProjectCards(locals.supabase) };
};
