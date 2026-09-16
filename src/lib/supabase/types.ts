// Minimal Database typing for the `projects` table.
// Column names match `Project` in `$lib/schema/projects.ts` (kept decoupled to avoid cycles).
// Shape mirrors `supabase gen types typescript` output (tables carry Relationships,
// schemas carry Views/Functions/Enums/CompositeTypes) so supabase-js query
// generics resolve instead of collapsing to `never`.
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

export type Database = {
	public: {
		Tables: {
			projects: {
				Row: ProjectsRow;
				Insert: Partial<ProjectsRow> & { title: string; slug: string; description: string };
				Update: Partial<ProjectsRow>;
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
};
