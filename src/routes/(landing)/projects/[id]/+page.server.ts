import { error, redirect } from '@sveltejs/kit';
import { getProjectByParam, UUID_RE } from '#lib/server/content.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, setHeaders, depends }) => {
	depends('supabase:projects');
	setHeaders({ 'cache-control': 'public, max-age=30, s-maxage=300' });

	const project = await getProjectByParam(locals.supabase, params.id);
	if (!project) throw error(404, 'Project not found');

	if (UUID_RE.test(params.id) && project.slug && project.slug !== params.id) {
		throw redirect(301, `/projects/${project.slug}`);
	}

	return { project };
};
