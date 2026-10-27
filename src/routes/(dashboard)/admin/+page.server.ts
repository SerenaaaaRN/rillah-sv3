import { getAdminOverview } from '#lib/server/content.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals, depends, setHeaders }) => {
	depends('supabase:projects');
	depends('supabase:certificates');
	setHeaders({ 'cache-control': 'private, no-store' });

	const overview = await getAdminOverview(locals.supabase);
	return overview;
};
