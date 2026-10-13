import { fail } from '@sveltejs/kit';
import { mapRowToCertificate } from '$lib/schema/certificate.js';
import { CERTIFICATES_SELECT, CERTIFICATES_TABLE } from '$lib/supabase/types.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals, depends, setHeaders }) => {
	depends('supabase:certificates');
	setHeaders({ 'cache-control': 'private, no-store' });
	const { data, error } = await locals.supabase
		.from(CERTIFICATES_TABLE)
		.select(CERTIFICATES_SELECT)
		.order('display_order', { ascending: true })
		.order('created_at', { ascending: false })
		.limit(100);

	if (error) {
		console.error('[admin/certificates] load failed:', error.message);
		return { certificates: [] };
	}
	return { certificates: (data ?? []).map(mapRowToCertificate) };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '').trim();
		if (!id) return fail(400, { error: 'Missing certificate id.' });

		const { error } = await locals.supabase.from(CERTIFICATES_TABLE).delete().eq('id', id);
		if (error) return fail(500, { error: error.message });
		return { success: true };
	}
};
