import { mapRowToCertificate } from '#lib/schema/certificate.js';
import { mapRowToProject } from '#lib/schema/projects.js';
import {
	CERTIFICATES_SELECT,
	CERTIFICATES_TABLE,
	PROJECTS_SELECT,
	PROJECTS_TABLE
} from '#lib/supabase/types.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals, depends, setHeaders }) => {
	depends('supabase:projects');
	depends('supabase:certificates');
	setHeaders({ 'cache-control': 'private, no-store' });
	const [projectsRes, certificatesRes] = await Promise.all([
		locals.supabase
			.from(PROJECTS_TABLE)
			.select(PROJECTS_SELECT)
			.order('display_order', { ascending: true })
			.order('created_at', { ascending: false })
			.limit(50),
		locals.supabase
			.from(CERTIFICATES_TABLE)
			.select(CERTIFICATES_SELECT)
			.order('display_order', { ascending: true })
			.order('created_at', { ascending: false })
			.limit(50)
	]);

	if (projectsRes.error) {
		console.error('[admin] projects load failed:', projectsRes.error.message);
	}

	if (certificatesRes.error) {
		console.error('[admin] certificates load failed:', certificatesRes.error.message);
	}

	return {
		projects: (projectsRes.data ?? []).map(mapRowToProject),
		certificates: (certificatesRes.data ?? []).map(mapRowToCertificate)
	};
};
