export type ProjectsRow = {
	id: string;
	title: string;
	slug: string;
	description: string;
	github: string | null;
	demo: string | null;
	tags: string[] | null;
	category: string[] | null;
	features: string[] | null;
	display_order: number | null;
	image: string[] | null;
	video: string | null;
	created_at: string;
	updated_at: string;
};

export type CertificatesRow = {
	id: string;
	title: string;
	issuer: string | null;
	date: string | null;
	image_url: string | null;
	display_order: number | null;
	created_at: string;
};

export type ReviewsRow = {
	id: number;
	name: string | null;
	message: string | null;
	created_at: string;
};

export type Database = {
	public: {
		Tables: {
			projects: {
				Row: ProjectsRow;
				Insert: Partial<ProjectsRow> & { title: string; slug: string; description: string };
				Update: Partial<ProjectsRow>;
				Relationships: [];
			};
			certificates: {
				Row: CertificatesRow;
				Insert: Partial<CertificatesRow> & { title: string };
				Update: Partial<CertificatesRow>;
				Relationships: [];
			};
			reviews: {
				Row: ReviewsRow;
				Insert: Partial<ReviewsRow> & { name: string; message: string };
				Update: Partial<ReviewsRow>;
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
};

/**
 * Supabase identifiers: table names, explicit column lists
 */

export const PROJECTS_TABLE = 'projects';
export const PROJECTS_SELECT =
	'id,title,slug,description,github,demo,tags,category,features,display_order,image,video,created_at,updated_at';
export const PROJECT_IMAGE_BUCKET = 'project-images';

export const CERTIFICATES_TABLE = 'certificates';
export const CERTIFICATES_SELECT = 'id,title,issuer,date,image_url,display_order,created_at';
export const CERTIFICATE_IMAGE_BUCKET = 'certificate-images';

export const REVIEWS_TABLE = 'reviews';
export const REVIEWS_SELECT = 'id,name,message,created_at';

/** Fallback display_order for unsorted rows. */
export const UNSORTED_ORDER = 99;
