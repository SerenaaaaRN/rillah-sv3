export const SITE_URL = 'https://rillah.dev';
export const SITE_NAME = 'Rillah';
export const SITE_LOCALE = 'en_US';
export const TWITTER_HANDLE = '@kareniaRila';
export const GOOGLE_SITE_VERIFICATION = 'aHSMduJM0DCsHPxUVB5WN0B0ft10DdcMxa2NivtztfA';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const SAME_AS = [
	'https://github.com/SerenaaaaRN',
	'https://linkedin.com/in/duhairillah',
	'https://instagram.com/__rillah',
	'https://x.com/kareniaRila'
];

export function canonicalUrl(path = '/'): string {
	return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function absoluteUrl(url: string | null | undefined): string {
	if (!url) return DEFAULT_OG_IMAGE;
	if (/^https?:\/\//i.test(url)) return url;
	return canonicalUrl(url);
}

export interface BreadcrumbItem {
	name: string;
	url: string;
}

export function personSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Duhairillah',
		alternateName: SITE_NAME,
		url: SITE_URL,
		sameAs: SAME_AS,
		jobTitle: 'Software Engineer'
	};
}

export function webSiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: `${SITE_NAME} | Software Engineer`,
		url: SITE_URL
	};
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: item.url
		}))
	};
}

export function creativeWorkSchema(input: {
	name: string;
	description: string;
	url: string;
	image?: string;
	datePublished?: string;
	dateModified?: string;
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: input.name,
		description: input.description,
		url: input.url,
		...(input.image ? { image: input.image } : {}),
		...(input.datePublished ? { datePublished: input.datePublished } : {}),
		...(input.dateModified ? { dateModified: input.dateModified } : {}),
		author: {
			'@type': 'Person',
			name: 'Duhairillah',
			url: SITE_URL
		}
	};
}
