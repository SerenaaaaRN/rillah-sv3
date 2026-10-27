import { fail, redirect } from '@sveltejs/kit';
import { mapInputToRow, ProjectSchema } from '#lib/schema/projects.js';
import { parseForm, validationFail } from '#lib/server/actions.js';
import { PROJECTS_TABLE } from '#lib/supabase/types.js';
import { formDataToRecord } from '#lib/utils/form.js';
import type { Actions } from './$types.js';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const { data, errors } = parseForm(ProjectSchema, formDataToRecord(await request.formData()));
		if (!data) return validationFail(errors);

		const row = mapInputToRow(data);

		// Friendlier error than Postgres 23505.
		const { data: existing } = await locals.supabase
			.from(PROJECTS_TABLE)
			.select('id')
			.eq('slug', row.slug)
			.maybeSingle();
		if (existing) return fail(400, { error: `Slug "${row.slug}" already exists.` });

		const { error } = await locals.supabase.from(PROJECTS_TABLE).insert(row);
		if (error) return fail(500, { error: error.message || 'Failed to create project.' });

		throw redirect(303, '/admin/projects');
	}
};
