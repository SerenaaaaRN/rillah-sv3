import { canonicalUrl } from '#lib/seo/site.js';
import { listProjectSlugs } from '#lib/server/content.js';
import { createStaticClient } from '#lib/supabase/static.js';
import type { RequestHandler } from './$types';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

interface SitemapEntry {
	loc: string;
	lastmod?: string;
	changefreq?: 'yearly' | 'monthly';
	priority?: number;
}

export const GET: RequestHandler = async ({ setHeaders }) => {
	setHeaders({
		'content-type': 'application/xml; charset=utf-8',
		'cache-control': 'public, max-age=0, s-maxage=3600'
	});

	const now = new Date().toISOString();

	const entries: SitemapEntry[] = [
		{ loc: canonicalUrl('/'), lastmod: now, changefreq: 'yearly', priority: 1 },
		{ loc: canonicalUrl('/projects'), lastmod: now, changefreq: 'monthly', priority: 0.9 },
		{ loc: canonicalUrl('/certificates'), lastmod: now, changefreq: 'monthly', priority: 0.9 }
	];

	for (const { slug, updated_at } of await listProjectSlugs(createStaticClient())) {
		entries.push({
			loc: canonicalUrl(`/projects/${slug}`),
			lastmod: updated_at || now,
			changefreq: 'monthly',
			priority: 0.8
		});
	}

	const urls = entries
		.map(
			(e) =>
				`  <url><loc>${escapeXml(e.loc)}</loc>` +
				(e.lastmod ? `<lastmod>${escapeXml(e.lastmod)}</lastmod>` : '') +
				(e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : '') +
				(e.priority !== undefined ? `<priority>${e.priority}</priority>` : '') +
				`</url>`
		)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
	);
};
