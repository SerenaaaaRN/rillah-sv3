import { error, redirect } from '@sveltejs/kit';
import { mapRowToProject } from '$lib/schema/projects.js';
import { PROJECTS_SELECT, PROJECTS_TABLE } from '$lib/supabase/types.js';
import type { PageServerLoad } from './$types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const load: PageServerLoad = async ({ params, locals, setHeaders, depends }) => {
	depends('supabase:projects');
	setHeaders({ 'cache-control': 'public, max-age=30, s-maxage=300' });

	const param = params.id;

	let row = null;
	if (UUID_RE.test(param)) {
		const { data: byId, error: idError } = await locals.supabase
			.from(PROJECTS_TABLE)
			.select(PROJECTS_SELECT)
			.eq('id', param)
			.maybeSingle();
		if (idError) console.error('[landing/projects/[id]] lookup by id failed:', idError.message);
		row = byId;
	}

	if (!row) {
		const { data: bySlug, error: slugError } = await locals.supabase
			.from(PROJECTS_TABLE)
			.select(PROJECTS_SELECT)
			.eq('slug', param)
			.maybeSingle();
		if (slugError)
			console.error('[landing/projects/[id]] lookup by slug failed:', slugError.message);
		row = bySlug;
	}

	if (!row) throw error(404, 'Project not found');

	if (UUID_RE.test(param) && row.slug && row.slug !== param) {
		throw redirect(301, `/projects/${row.slug}`);
	}

	return { project: mapRowToProject(row) };
};
