import { fail, redirect } from '@sveltejs/kit';
import {
	CERTIFICATE_IMAGE_BUCKET,
	CERTIFICATES_TABLE,
	CertificateSchema,
	mapInputToRow
} from '$lib/schema/certificate.js';
import { createUploadAction } from '$lib/supabase/upload-action.js';
import { formDataToRecord } from '$lib/utils/form.js';
import type { Actions } from './$types.js';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const form = await request.formData();
		const parsed = CertificateSchema.safeParse(formDataToRecord(form));
		if (!parsed.success) {
			return fail(400, {
				error: 'Validation failed.',
				errors: parsed.error.flatten().fieldErrors
			});
		}

		const row = mapInputToRow(parsed.data);

		const { error } = await locals.supabase.from(CERTIFICATES_TABLE).insert(row);
		if (error) return fail(500, { error: error.message });

		throw redirect(303, '/admin/certificates');
	},

	uploadImage: createUploadAction({
		bucket: CERTIFICATE_IMAGE_BUCKET,
		maxBytes: 5 * 1024 * 1024,
		mimePrefix: 'image/',
		kindLabel: 'images'
	})
};
