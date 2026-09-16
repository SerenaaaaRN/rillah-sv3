import { z } from 'zod';
import { parseJsonOrCsv } from '$lib/utils/array.js';

export type Project = {
	id: string;
	title: string;
	description: string;
	image: string[];
	video?: string;
	tags: string[];
	github: string;
	demo: string;
	featured: string[];
	slug: string;
	content?: string;
	features?: string[];
	display_order?: number;
	created_at?: string;
	updated_at?: string;
};

export type ProjectFormState = {
	status: 'idle' | 'success' | 'error';
	message: string;
	errors?: Record<string, string[]>;
};

export const UNSORTED_ORDER = 99;

export const PROJECTS_TABLE = 'projects';
export const PROJECT_IMAGE_BUCKET = 'project-images';
export const PROJECT_VIDEO_BUCKET = 'project-videos';

export const ProjectSchema = z.object({
	title: z.string().min(1, 'Title is required.').max(200),
	slug: z.string().min(1, 'Slug is required.').max(200),
	description: z.string().min(1, 'Description is required.').max(1000),
	content: z.string().optional().default(''),
	github: z
		.string()
		.nullable()
		.transform((val) => val ?? ''),
	demo: z
		.string()
		.nullable()
		.transform((val) => val ?? ''),
	tags: z.string().transform(parseJsonOrCsv),
	featured: z.string().transform(parseJsonOrCsv),
	features: z.string().transform(parseJsonOrCsv),
	display_order: z.coerce.number().optional().default(0),
	image: z.string().transform(parseJsonOrCsv),
	video: z.string().optional().default('')
});

export type ProjectInput = z.infer<typeof ProjectSchema>;

// --- Supabase row mapping ---
// Table `projects` columns mirror `Project` 1:1.
import type { ProjectsRow } from '$lib/supabase/types.js';

const asStringArray = (val: unknown): string[] => {
	if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string');
	return parseJsonOrCsv(val);
};

export function mapRowToProject(row: ProjectsRow): Project {
	return {
		id: row.id,
		title: row.title,
		slug: row.slug,
		description: row.description,
		content: row.content ?? '',
		github: row.github ?? '',
		demo: row.demo ?? '',
		tags: asStringArray(row.tags),
		featured: asStringArray(row.featured),
		features: asStringArray(row.features),
		display_order: row.display_order ?? UNSORTED_ORDER,
		image: asStringArray(row.image),
		video: row.video ?? '',
		created_at: row.created_at,
		updated_at: row.updated_at
	};
}

export function mapInputToRow(
	input: ProjectInput
): Omit<ProjectsRow, 'id' | 'created_at' | 'updated_at'> {
	return {
		title: input.title.trim(),
		slug: input.slug.trim(),
		description: input.description.trim(),
		content: input.content ?? '',
		github: input.github || null,
		demo: input.demo || null,
		tags: input.tags,
		featured: input.featured,
		features: input.features,
		display_order: input.display_order ?? UNSORTED_ORDER,
		image: input.image,
		video: input.video || null
	};
}

// View shape produced by public route mappers (landing grid/detail) from Project.
export type ProjectCard = {
	id: string;
	slug: string;
	title: string;
	description: string;
	url: string;
	image: string | null;
	images: string[];
	video: string;
	source_code: string | null;
	tags: string[];
	created_at: string;
	updated_at: string;
};
