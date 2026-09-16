import { error } from '@sveltejs/kit';
import { mapRowToProject, PROJECTS_TABLE } from '$lib/schema/projects.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, setHeaders, depends }) => {
	depends('supabase:projects');
	setHeaders({ 'cache-control': 'public, max-age=30, s-maxage=300' });

	const param = params.id;
	const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);

	let row = null;
	if (isUuid) {
		const { data: byId, error: idError } = await locals.supabase
			.from(PROJECTS_TABLE)
			.select('*')
			.eq('id', param)
			.maybeSingle();

		if (idError) console.error('[landing/projects/[id]] lookup by id failed:', idError.message);
		row = byId;
	}

	if (!row) {
		const { data: bySlug, error: slugError } = await locals.supabase
			.from(PROJECTS_TABLE)
			.select('*')
			.eq('slug', param)
			.maybeSingle();

		if (slugError)
			console.error('[landing/projects/[id]] lookup by slug failed:', slugError.message);
		row = bySlug;
	}

	if (!row) throw error(404, 'Project not found');

	return { project: mapRowToProject(row) };
};
