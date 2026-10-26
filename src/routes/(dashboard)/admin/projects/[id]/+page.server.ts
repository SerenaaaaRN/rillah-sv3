import { error, fail, redirect } from '@sveltejs/kit';
import { mapInputToRow, mapRowToProject, ProjectSchema } from '#lib/schema/projects.js';
import { PROJECTS_SELECT, PROJECTS_TABLE } from '#lib/supabase/types.js';
import { formDataToRecord } from '#lib/utils/form.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, locals, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-store' });
	const { data, error: dbError } = await locals.supabase
		.from(PROJECTS_TABLE)
		.select(PROJECTS_SELECT)
		.eq('id', params.id)
		.single();

	if (dbError || !data) throw error(404, 'Project not found.');
	return { project: mapRowToProject(data) };
};

export const actions: Actions = {
	update: async ({ request, locals, params }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? params.id ?? '').trim();
		if (!id) return fail(400, { error: 'Missing project id.' });

		const parsed = ProjectSchema.safeParse(formDataToRecord(form));
		if (!parsed.success) {
			return fail(400, {
				error: 'Validation failed.',
				errors: parsed.error.flatten().fieldErrors
			});
		}

		const row = mapInputToRow(parsed.data);

		const { data: clash } = await locals.supabase
			.from(PROJECTS_TABLE)
			.select('id')
			.eq('slug', row.slug)
			.neq('id', id)
			.maybeSingle();
		if (clash) return fail(400, { error: `Slug "${row.slug}" already used.` });

		const { error: dbError } = await locals.supabase
			.from(PROJECTS_TABLE)
			.update({ ...row, updated_at: new Date().toISOString() })
			.eq('id', id);
		if (dbError) return fail(500, { error: dbError.message });

		throw redirect(303, '/admin/projects');
	}
};
