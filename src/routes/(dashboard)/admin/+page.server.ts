import { CERTIFICATES_TABLE, mapRowToCertificate } from '$lib/schema/certificate.js';
import { mapRowToProject, PROJECTS_TABLE } from '$lib/schema/projects.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals }) => {
	const [projectsRes, certificatesRes] = await Promise.all([
		locals.supabase
			.from(PROJECTS_TABLE)
			.select('*')
			.order('display_order', { ascending: true })
			.order('created_at', { ascending: false }),
		locals.supabase
			.from(CERTIFICATES_TABLE)
			.select('*')
			.order('display_order', { ascending: true })
			.order('created_at', { ascending: false })
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
