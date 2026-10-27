import { z } from 'zod';
import { UNSORTED_ORDER, type ProjectsRow } from '#lib/supabase/types.js';
import { asStringArray, parseJsonOrCsv } from '#lib/utils/array.js';
import { getGithubThumbnailUrl } from '#lib/utils/image.js';

export const PROJECT_CATEGORIES = ['Full Stack App', 'Data Science', 'AI', 'Education'] as const;

/** Empty/blank inputs resolve to UNSORTED_ORDER instead of 0. */
const orderInput = z.preprocess(
	(v) => (v === '' || v === null || v === undefined ? undefined : v),
	z.coerce.number().int().min(0).optional().default(UNSORTED_ORDER)
);

export const ProjectSchema = z.object({
	title: z.string().min(1, 'Title is required.').max(200),
	slug: z.string().min(1, 'Slug is required.').max(200),
	description: z.string().min(1, 'Description is required.').max(1000),
	github: z
		.string()
		.nullable()
		.transform((val) => val ?? ''),
	demo: z
		.string()
		.nullable()
		.transform((val) => val ?? ''),
	tags: z.string().transform(parseJsonOrCsv),
	category: z.enum(PROJECT_CATEGORIES),
	features: z.string().transform(parseJsonOrCsv),
	display_order: orderInput,
	image: z.string().transform(parseJsonOrCsv),
	video: z.string().optional().default('')
});

export type ProjectInput = z.infer<typeof ProjectSchema>;

export type Project = {
	id: string;
	title: string;
	description: string;
	image: string[];
	video?: string;
	tags: string[];
	github: string;
	demo: string;
	category: string;
	slug: string;
	features?: string[];
	display_order?: number;
	created_at?: string;
	updated_at?: string;
};

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
	category: string;
	created_at: string;
	updated_at: string;
};

export function toProjectCard(p: Project): ProjectCard {
	return {
		id: p.id,
		slug: p.slug,
		title: p.title,
		description: p.description,
		url: p.demo,
		image: p.image[0] ?? null,
		images: p.image,
		video: p.video ?? '',
		source_code: p.github || null,
		tags: p.tags,
		category: p.category,
		created_at: p.created_at ?? '',
		updated_at: p.updated_at ?? ''
	};
}

export function mapRowToProject(row: ProjectsRow): Project {
	return {
		id: row.id,
		title: row.title,
		slug: row.slug,
		description: row.description,
		github: row.github ?? '',
		demo: row.demo ?? '',
		tags: asStringArray(row.tags),
		category: row.category ?? '',
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
	let image = input.image;
	if (image.length === 0) {
		const thumbnail = getGithubThumbnailUrl(input.github ?? '');
		if (thumbnail) image = [thumbnail];
	}
	return {
		title: input.title.trim(),
		slug: input.slug.trim(),
		description: input.description.trim(),
		github: input.github || null,
		demo: input.demo || null,
		tags: input.tags,
		category: input.category,
		features: input.features,
		display_order: input.display_order ?? UNSORTED_ORDER,
		image,
		video: input.video || null
	};
}
