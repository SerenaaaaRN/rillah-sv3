import type { SupabaseClient } from '@supabase/supabase-js';
import {
	mapCertificateToCertification,
	mapRowToCertificate,
	type Certification
} from '#lib/schema/certificate.js';
import type { GuestbookEntry } from '#lib/schema/guestbook.js';
import {
	mapRowToProject,
	toProjectCard,
	type Project,
	type ProjectCard
} from '#lib/schema/projects.js';
import {
	CERTIFICATES_SELECT,
	CERTIFICATES_TABLE,
	PROJECTS_SELECT,
	PROJECTS_TABLE,
	REVIEWS_SELECT,
	REVIEWS_TABLE
} from '#lib/supabase/types.js';

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ORDER = { ascending: true } as const;

interface Listed<T> {
	rows: T[];
	/** Exact row count when `count` was requested, else null. */
	count: number | null;
}

async function listProjects(
	supabase: SupabaseClient,
	limit?: number,
	count?: boolean
): Promise<Listed<Project>> {
	let query = supabase
		.from(PROJECTS_TABLE)
		.select(PROJECTS_SELECT, count ? { count: 'exact' } : undefined)
		.order('display_order', ORDER)
		.order('created_at', { ascending: false });

	if (limit !== undefined) query = query.limit(limit);

	const { data, error, count: exact } = await query;
	if (error) {
		console.error('[content] listProjects failed:', error.message);
		return { rows: [], count: exact ?? null };
	}
	return { rows: (data ?? []).map(mapRowToProject), count: exact ?? null };
}

async function listCertificates(
	supabase: SupabaseClient,
	limit?: number,
	count?: boolean
): Promise<Listed<ReturnType<typeof mapRowToCertificate>>> {
	let query = supabase
		.from(CERTIFICATES_TABLE)
		.select(CERTIFICATES_SELECT, count ? { count: 'exact' } : undefined)
		.order('display_order', ORDER)
		.order('created_at', { ascending: false });

	if (limit !== undefined) query = query.limit(limit);

	const { data, error, count: exact } = await query;
	if (error) {
		console.error('[content] listCertificates failed:', error.message);
		return { rows: [], count: exact ?? null };
	}
	return { rows: (data ?? []).map(mapRowToCertificate), count: exact ?? null };
}

/** Public projects list for `/projects` (public read, 30 s browser / 5 min edge cache handled by caller). */
export async function getProjects(supabase: SupabaseClient): Promise<Project[]> {
	return (await listProjects(supabase)).rows;
}

/** Public projects list mapped to card view models for the `/projects` grid. */
export async function getProjectCards(supabase: SupabaseClient): Promise<ProjectCard[]> {
	return (await listProjects(supabase)).rows.map(toProjectCard);
}

/** Public single project by UUID id or slug; null when not found. Errors are logged, not thrown. */
export async function getProjectByParam(
	supabase: SupabaseClient,
	param: string
): Promise<Project | null> {
	if (UUID_RE.test(param)) {
		const { data, error } = await supabase
			.from(PROJECTS_TABLE)
			.select(PROJECTS_SELECT)
			.eq('id', param)
			.maybeSingle();
		if (error) console.error('[content] project lookup by id failed:', error.message);
		if (data) return mapRowToProject(data);
	}

	const { data, error } = await supabase
		.from(PROJECTS_TABLE)
		.select(PROJECTS_SELECT)
		.eq('slug', param)
		.maybeSingle();
	if (error) console.error('[content] project lookup by slug failed:', error.message);
	return data ? mapRowToProject(data) : null;
}

export async function getCertificates(supabase: SupabaseClient) {
	return (await listCertificates(supabase)).rows;
}

/** Certifications for the landing hero section (display order only, no created_at tiebreaker). */
export async function listCertifications(supabase: SupabaseClient): Promise<Certification[]> {
	const { data, error } = await supabase
		.from(CERTIFICATES_TABLE)
		.select(CERTIFICATES_SELECT)
		.order('display_order', ORDER);
	if (error) {
		console.error('[content] listCertifications failed:', error.message);
		return [];
	}
	return (data ?? []).map(mapRowToCertificate).map(mapCertificateToCertification);
}

export async function listGuestbook(supabase: SupabaseClient): Promise<GuestbookEntry[]> {
	const { data, error } = await supabase
		.from(REVIEWS_TABLE)
		.select(REVIEWS_SELECT)
		.order('created_at', { ascending: false });
	if (error) {
		console.warn('[content] listGuestbook failed:', error.message);
		return [];
	}
	return (data ?? []).map((r) => ({
		id: String(r.id),
		name: String(r.name ?? ''),
		message: String(r.message ?? ''),
		created_at: String(r.created_at ?? '')
	}));
}

export async function insertGuestbook(
	supabase: SupabaseClient,
	input: { name: string; message: string }
): Promise<string | null> {
	const { error } = await supabase.from(REVIEWS_TABLE).insert(input);
	return error?.message ?? null;
}

export interface AdminOverview {
	projectCount: number;
	certificateCount: number;
	recentProjects: Project[];
	recentCertificates: ReturnType<typeof mapRowToCertificate>[];
}

/** Admin dashboard data: exact counts + latest 3 previews. Single round-trip pair per table. */
export async function getAdminOverview(supabase: SupabaseClient): Promise<AdminOverview> {
	const [projects, certificates] = await Promise.all([
		listProjects(supabase, 3, true),
		listCertificates(supabase, 3, true)
	]);

	return {
		projectCount: projects.count ?? projects.rows.length,
		certificateCount: certificates.count ?? certificates.rows.length,
		recentProjects: projects.rows,
		recentCertificates: certificates.rows
	};
}

export interface AdminList<T> {
	rows: T[];
	total: number | null;
}

export async function listAdminProjects(supabase: SupabaseClient): Promise<AdminList<Project>> {
	const { rows, count } = await listProjects(supabase, 100, true);
	return { rows, total: count };
}

export async function listAdminCertificates(
	supabase: SupabaseClient
): Promise<AdminList<ReturnType<typeof mapRowToCertificate>>> {
	const { rows, count } = await listCertificates(supabase, 100, true);
	return { rows, total: count };
}

export interface ProjectSitemapEntry {
	slug: string;
	updated_at: string;
}

export async function listProjectSlugs(supabase: SupabaseClient): Promise<ProjectSitemapEntry[]> {
	const { data, error } = await supabase
		.from(PROJECTS_TABLE)
		.select('slug, updated_at')
		.order('display_order', ORDER)
		.order('created_at', { ascending: false });
	if (error) {
		console.error('[content] listProjectSlugs failed:', error.message);
		return [];
	}
	return (data ?? []).filter((row): row is { slug: string; updated_at: string } =>
		Boolean(row.slug)
	);
}
