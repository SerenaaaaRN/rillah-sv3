import { fail } from '@sveltejs/kit';
import {
	mapRowToProject,
	PROJECT_IMAGE_BUCKET,
	PROJECT_VIDEO_FOLDER,
	PROJECTS_TABLE
} from '$lib/schema/projects.js';
import { createUploadAction } from '$lib/supabase/upload-action.js';
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
