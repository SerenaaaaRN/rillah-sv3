const slugify = (input: string): string => {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
};

export interface SlugFieldOptions {
	initialTitle?: string;
	initialSlug?: string;
	locked?: boolean;
	fallback?: string;
}

/**
 * Reactive title <-> slug field pair with auto/manual mode.
 *
 * Shared by the project and certificate admin forms. Markup stays
 * in each form — only state + handlers are shared.
 */
export const slugField = ({
	initialTitle = '',
	initialSlug,
	locked = false,
	fallback = ''
}: SlugFieldOptions = {}) => {
	let title = $state(initialTitle);
	let slug = $state((initialSlug ?? slugify(initialTitle)) || fallback);
	let slugLocked = $state(locked);

	const handleTitleInput = (e: Event) => {
		title = (e.target as HTMLInputElement).value;
		if (!slugLocked) slug = slugify(title) || fallback;
	};

	const handleSlugInput = (e: Event) => {
		slug = slugify((e.target as HTMLInputElement).value);
		slugLocked = true;
	};

	const toggleSlugMode = () => {
		slugLocked = !slugLocked;
		if (!slugLocked) slug = slugify(title) || fallback;
	};

	return {
		get title() {
			return title;
		},
		set title(v: string) {
			title = v;
		},
		get slug() {
			return slug;
		},
		set slug(v: string) {
			slug = v;
		},
		get slugLocked() {
			return slugLocked;
		},
		handleTitleInput,
		handleSlugInput,
		toggleSlugMode
	};
};
