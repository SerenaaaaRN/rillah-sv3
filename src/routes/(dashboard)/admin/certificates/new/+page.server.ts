import { fail, redirect } from '@sveltejs/kit';
import { CertificateSchema, mapInputToRow } from '#lib/schema/certificate.js';
import { dbFail, parseForm, validationFail } from '#lib/server/actions.js';
import { CERTIFICATES_TABLE } from '#lib/supabase/types.js';
import { formDataToRecord } from '#lib/utils/form.js';
import type { Actions } from './$types.js';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const { data, errors } = parseForm(
			CertificateSchema,
			formDataToRecord(await request.formData())
		);
		if (!data) return validationFail(errors);

		const { error } = await locals.supabase.from(CERTIFICATES_TABLE).insert(mapInputToRow(data));
		if (error) return dbFail(error.message);

		throw redirect(303, '/admin/certificates');
	}
};
