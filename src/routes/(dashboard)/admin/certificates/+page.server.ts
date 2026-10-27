import { dbFail, missingIdFail } from '#lib/server/actions.js';
import { listAdminCertificates } from '#lib/server/content.js';
import { CERTIFICATES_TABLE } from '#lib/supabase/types.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals, depends, setHeaders }) => {
	depends('supabase:certificates');
	setHeaders({ 'cache-control': 'private, no-store' });
	const { rows, total } = await listAdminCertificates(locals.supabase);
	return { certificates: rows, totalCertificates: total ?? rows.length };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const id = String((await request.formData()).get('id') ?? '').trim();
		if (!id) return missingIdFail('certificate');

		const { error } = await locals.supabase.from(CERTIFICATES_TABLE).delete().eq('id', id);
		if (error) return dbFail(error.message);
		return { success: true };
	}
};
