export type ProjectsRow = {
	id: string;
	title: string;
	slug: string;
	description: string;
	content: string | null;
	github: string | null;
	demo: string | null;
	tags: string[] | null;
	featured: string[] | null;
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
