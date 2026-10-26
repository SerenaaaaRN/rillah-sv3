import { mapRowToCertificate, type Certificate } from '#lib/schema/certificate.js';
import { CERTIFICATES_SELECT, CERTIFICATES_TABLE } from '#lib/supabase/types.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders, depends }) => {
	depends('supabase:certificates');
	setHeaders({ 'cache-control': 'public, max-age=30, s-maxage=300' });

	const { data, error } = await locals.supabase
		.from(CERTIFICATES_TABLE)
		.select(CERTIFICATES_SELECT)
		.order('display_order', { ascending: true })
		.order('created_at', { ascending: false });

	if (error) {
		console.error('[landing/certificates] load failed:', error.message);
		return { certificates: [] as Certificate[] };
	}
	return { certificates: (data ?? []).map(mapRowToCertificate) };
};
