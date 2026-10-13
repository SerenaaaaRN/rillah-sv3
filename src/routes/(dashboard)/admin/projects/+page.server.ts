import { fail } from '@sveltejs/kit';
import { mapRowToProject } from '$lib/schema/projects.js';
import { PROJECTS_SELECT, PROJECTS_TABLE } from '$lib/supabase/types.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals, depends, setHeaders }) => {
	depends('supabase:projects');
	setHeaders({ 'cache-control': 'private, no-store' });
	const { data, error } = await locals.supabase
		.from(PROJECTS_TABLE)
		.select(PROJECTS_SELECT)
		.order('display_order', { ascending: true })
		.order('created_at', { ascending: false })
		.limit(100);

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
	}
};
