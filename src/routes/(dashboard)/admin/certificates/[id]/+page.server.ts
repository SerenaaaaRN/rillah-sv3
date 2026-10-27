import { error, redirect } from '@sveltejs/kit';
import { CertificateSchema, mapInputToRow, mapRowToCertificate } from '#lib/schema/certificate.js';
import { dbFail, missingIdFail, parseForm, validationFail } from '#lib/server/actions.js';
import { CERTIFICATES_SELECT, CERTIFICATES_TABLE } from '#lib/supabase/types.js';
import { formDataToRecord } from '#lib/utils/form.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, locals, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-store' });
	const { data, error: dbError } = await locals.supabase
		.from(CERTIFICATES_TABLE)
		.select(CERTIFICATES_SELECT)
		.eq('id', params.id)
		.single();

	if (dbError || !data) throw error(404, 'Certificate not found.');
	return { certificate: mapRowToCertificate(data) };
};

export const actions: Actions = {
	update: async ({ request, locals, params }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? params.id ?? '').trim();
		if (!id) return missingIdFail('certificate');

		const { data, errors } = parseForm(CertificateSchema, formDataToRecord(form));
		if (!data) return validationFail(errors);

		const { error: dbError } = await locals.supabase
			.from(CERTIFICATES_TABLE)
			.update(mapInputToRow(data))
			.eq('id', id);
		if (dbError) return dbFail(dbError.message);

		throw redirect(303, '/admin/certificates');
	}
};
