import { fail, redirect } from '@sveltejs/kit';
import {
	mapInputToRow,
	PROJECT_IMAGE_BUCKET,
	PROJECT_VIDEO_FOLDER,
	PROJECTS_TABLE,
	ProjectSchema
} from '$lib/schema/projects.js';
import { createUploadAction } from '$lib/supabase/upload-action.js';
import { formDataToRecord } from '$lib/utils/form.js';
import type { Actions } from './$types.js';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const form = await request.formData();
		const parsed = ProjectSchema.safeParse(formDataToRecord(form));
		if (!parsed.success) {
			return fail(400, {
				error: 'Validation failed.',
				errors: parsed.error.flatten().fieldErrors
			});
		}

		const row = mapInputToRow(parsed.data);

		// Guard duplicate slug for nicer error than Postgres 23505.
		const { data: existing } = await locals.supabase
			.from(PROJECTS_TABLE)
			.select('id')
			.eq('slug', row.slug)
			.maybeSingle();
		if (existing) return fail(400, { error: `Slug "${row.slug}" already exists.` });

		const { error } = await locals.supabase.from(PROJECTS_TABLE).insert(row);
		if (error) return fail(500, { error: error.message });

		throw redirect(303, '/admin/projects');
	},

	uploadImage: createUploadAction({
		bucket: PROJECT_IMAGE_BUCKET,
		maxBytes: 5 * 1024 * 1024,
		mimePrefix: 'image/',
		kindLabel: 'images'
	}),

	uploadVideo: createUploadAction({
		bucket: PROJECT_IMAGE_BUCKET,
		folder: PROJECT_VIDEO_FOLDER,
		maxBytes: 50 * 1024 * 1024,
		mimePrefix: 'video/',
		kindLabel: 'videos'
	})
};
