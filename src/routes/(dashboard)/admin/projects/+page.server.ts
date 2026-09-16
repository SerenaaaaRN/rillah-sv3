import { fail } from '@sveltejs/kit';
import {
	mapRowToProject,
	PROJECT_IMAGE_BUCKET,
	PROJECT_VIDEO_BUCKET,
	PROJECTS_TABLE
} from '$lib/schema/projects.js';
import { uploadToBucket } from '$lib/supabase/upload.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals }) => {
	const { data, error } = await locals.supabase
		.from(PROJECTS_TABLE)
		.select('*')
		.order('display_order', { ascending: true })
		.order('created_at', { ascending: false });

	if (error) {
		console.error('[admin/projects] load failed:', error.message);
		return { projects: [] };
	}

	return { projects: (data ?? []).map(mapRowToProject) };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '').trim();
		if (!id) return fail(400, { error: 'Missing project id.' });

		const { error } = await locals.supabase.from(PROJECTS_TABLE).delete().eq('id', id);
		if (error) return fail(500, { error: error.message });
		return { success: true };
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
