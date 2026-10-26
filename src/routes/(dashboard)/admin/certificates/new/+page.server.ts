import { fail, redirect } from '@sveltejs/kit';
import { CertificateSchema, mapInputToRow } from '#lib/schema/certificate.js';
import { CERTIFICATES_TABLE } from '#lib/supabase/types.js';
import { formDataToRecord } from '#lib/utils/form.js';
import type { Actions } from './$types.js';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const parsed = CertificateSchema.safeParse(formDataToRecord(await request.formData()));
		if (!parsed.success) {
			return fail(400, {
				error: 'Validation failed.',
				errors: parsed.error.flatten().fieldErrors
			});
		}

		const { error } = await locals.supabase
			.from(CERTIFICATES_TABLE)
			.insert(mapInputToRow(parsed.data));
		if (error) return fail(500, { error: error.message });

		throw redirect(303, '/admin/certificates');
	}
};
