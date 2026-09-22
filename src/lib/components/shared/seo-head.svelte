<script lang="ts">
	import { DEFAULT_OG_IMAGE, SITE_LOCALE, SITE_NAME, TWITTER_HANDLE } from '$lib/seo/site.js';

	interface Props {
		title: string;
		description: string;
		canonical: string;
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		noindex?: boolean;
		jsonLd?: Record<string, unknown>[];
	}

	let {
		title,
		description,
		canonical,
		type = 'website',
		image = DEFAULT_OG_IMAGE,
		imageAlt = title,
		noindex = false,
		jsonLd = []
	}: Props = $props();

	const tag = 'script';
	const jsonLdScripts = $derived(
		jsonLd.map(
			(d) =>
				`<${tag} type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</${tag}>`
		)
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={`${SITE_NAME} Portfolio`} />
	<meta property="og:locale" content={SITE_LOCALE} />
	<meta property="og:image" content={image} />
	<meta property="og:image:alt" content={imageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:creator" content={TWITTER_HANDLE} />
	<meta name="twitter:image" content={image} />
	{#each jsonLdScripts as script (script)}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- payload is self-generated JSON with `<` unicode-escaped, no user input -->
		{@html script}
	{/each}
</svelte:head>
