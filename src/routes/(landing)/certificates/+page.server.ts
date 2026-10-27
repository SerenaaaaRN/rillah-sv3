import { getCertificates } from '#lib/server/content.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders, depends }) => {
	depends('supabase:certificates');
	setHeaders({ 'cache-control': 'public, max-age=30, s-maxage=300' });

	return { certificates: await getCertificates(locals.supabase) };
};
