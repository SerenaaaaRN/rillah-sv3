import { dbFail, missingIdFail } from '#lib/server/actions.js';
import { listAdminProjects } from '#lib/server/content.js';
import { PROJECTS_TABLE } from '#lib/supabase/types.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals, depends, setHeaders }) => {
	depends('supabase:projects');
	setHeaders({ 'cache-control': 'private, no-store' });
	const { rows, total } = await listAdminProjects(locals.supabase);
	return { projects: rows, totalProjects: total ?? rows.length };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const id = String((await request.formData()).get('id') ?? '').trim();
		if (!id) return missingIdFail('project');

		const { error } = await locals.supabase.from(PROJECTS_TABLE).delete().eq('id', id);
		if (error) return dbFail(error.message);
		return { success: true };
	}
};
