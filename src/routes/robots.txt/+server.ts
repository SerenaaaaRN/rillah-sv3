import { SITE_URL } from '$lib/seo/site.js';
import type { RequestHandler } from './$types';

const AI_SEARCH_BOTS = ['OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'];
const AI_TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended', 'Bytespider'];

export const GET: RequestHandler = async ({ setHeaders }) => {
	setHeaders({
		'content-type': 'text/plain; charset=utf-8',
		'cache-control': 'public, max-age=0, s-maxage=3600'
	});

	const lines = [
		'User-agent: *',
		'Allow: /',
		'Disallow: /admin/',
		'Disallow: /login/',
		'Disallow: /api/',
		'Disallow: /private/',
		'',
		...AI_SEARCH_BOTS.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
		...AI_TRAINING_BOTS.flatMap((bot) => [`User-agent: ${bot}`, 'Disallow: /', '']),
		`Sitemap: ${SITE_URL}/sitemap.xml`,
		''
	];

	return new Response(lines.join('\n'));
};
