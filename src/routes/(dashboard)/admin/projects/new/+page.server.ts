import { fail, redirect } from '@sveltejs/kit';
import {
	mapInputToRow,
	PROJECT_IMAGE_BUCKET,
	PROJECT_VIDEO_BUCKET,
	PROJECTS_TABLE,
	ProjectSchema
} from '$lib/schema/projects.js';
import { uploadToBucket } from '$lib/supabase/upload.js';
import type { Actions } from './$types.js';

function toRecord(form: FormData): Record<string, string> {
	const out: Record<string, string> = {};
	form.forEach((value, key) => {
		if (typeof value === 'string') out[key] = value;
	});
	return out;
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const form = await request.formData();
		const parsed = ProjectSchema.safeParse(toRecord(form));
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

	uploadImage: async ({ request, locals }) => {
		const form = await request.formData();
		const file = form.get('file');
		const slug = String(form.get('slug') ?? 'temp');
		if (!(file instanceof File) || file.size === 0) return fail(400, { error: 'No file.' });
		if (!file.type.startsWith('image/')) return fail(400, { error: 'Only images allowed.' });
		try {
			const publicUrl = await uploadToBucket(
				locals.supabase,
				PROJECT_IMAGE_BUCKET,
				slug,
				file,
				5 * 1024 * 1024
			);
			return { publicUrl };
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : 'Upload failed.' });
		}
	},

	uploadVideo: async ({ request, locals }) => {
		const form = await request.formData();
		const file = form.get('file');
		const slug = String(form.get('slug') ?? 'temp');
		if (!(file instanceof File) || file.size === 0) return fail(400, { error: 'No file.' });
		if (!file.type.startsWith('video/')) return fail(400, { error: 'Only videos allowed.' });
		try {
			const publicUrl = await uploadToBucket(
				locals.supabase,
				PROJECT_VIDEO_BUCKET,
				slug,
				file,
				50 * 1024 * 1024
			);
			return { publicUrl };
		} catch (e) {
			return fail(500, { error: e instanceof Error ? e.message : 'Upload failed.' });
		}
	}
};
