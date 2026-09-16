import { error, fail, redirect } from '@sveltejs/kit';
import {
	CERTIFICATE_IMAGE_BUCKET,
	CERTIFICATES_TABLE,
	CertificateSchema,
	mapInputToRow,
	mapRowToCertificate
} from '$lib/schema/certificate.js';
import { createUploadAction } from '$lib/supabase/upload-action.js';
import { formDataToRecord } from '$lib/utils/form.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { data, error: dbError } = await locals.supabase
		.from(CERTIFICATES_TABLE)
		.select('*')
		.eq('id', params.id)
		.single();

	if (dbError || !data) throw error(404, 'Certificate not found.');
	return { certificate: mapRowToCertificate(data) };
};

export const actions: Actions = {
	update: async ({ request, locals, params }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? params.id ?? '').trim();
		if (!id) return fail(400, { error: 'Missing certificate id.' });

		const parsed = CertificateSchema.safeParse(formDataToRecord(form));
		if (!parsed.success) {
			return fail(400, {
				error: 'Validation failed.',
				errors: parsed.error.flatten().fieldErrors
			});
		}

		const row = mapInputToRow(parsed.data);

		const { error: dbError } = await locals.supabase
			.from(CERTIFICATES_TABLE)
			.update(row)
			.eq('id', id);
		if (dbError) return fail(500, { error: dbError.message });

		throw redirect(303, '/admin/certificates');
	},

	uploadImage: createUploadAction({
		bucket: CERTIFICATE_IMAGE_BUCKET,
		maxBytes: 5 * 1024 * 1024,
		mimePrefix: 'image/',
		kindLabel: 'images'
	})
};
