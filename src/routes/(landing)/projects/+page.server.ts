import {
	mapRowToProject,
	PROJECTS_TABLE,
	toProjectCard,
	type ProjectCard
} from '$lib/schema/projects.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders, depends }) => {
	depends('supabase:projects');
	setHeaders({ 'cache-control': 'public, max-age=30, s-maxage=300' });

	const { data, error } = await locals.supabase
		.from(PROJECTS_TABLE)
		.select('*')
		.order('display_order', { ascending: true })
		.order('created_at', { ascending: false });

	if (error) {
		console.error('[landing/projects] load failed:', error.message);
		return { projects: [] as ProjectCard[] };
	}

	return { projects: (data ?? []).map(mapRowToProject).map(toProjectCard) };
};
