import { fail, redirect } from '@sveltejs/kit';
import { mapInputToRow, ProjectSchema } from '#lib/schema/projects.js';
import { PROJECTS_TABLE } from '#lib/supabase/types.js';
import { formDataToRecord } from '#lib/utils/form.js';
import type { Actions } from './$types.js';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const parsed = ProjectSchema.safeParse(formDataToRecord(await request.formData()));
		if (!parsed.success) {
			return fail(400, {
				error: 'Validation failed.',
				errors: parsed.error.flatten().fieldErrors
			});
		}

		const row = mapInputToRow(parsed.data);

		// Friendlier error than Postgres 23505.
		const { data: existing } = await locals.supabase
			.from(PROJECTS_TABLE)
			.select('id')
			.eq('slug', row.slug)
			.maybeSingle();
		if (existing) return fail(400, { error: `Slug "${row.slug}" already exists.` });

		const { error } = await locals.supabase.from(PROJECTS_TABLE).insert(row);
		if (error) return fail(500, { error: error.message });

		throw redirect(303, '/admin/projects');
	}
};
