<script lang="ts">
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { careers } from '$lib/data/career.js';
	import { educations } from '$lib/data/education.js';
	import { canonicalUrl, personSchema, webSiteSchema } from '$lib/seo/site.js';
	import About from './_components/about.svelte';
	import Career from './_components/career.svelte';
	import Certification from './_components/certificates/certificates-landing.svelte';
	import Contribution from './_components/contribution/contribution.svelte';
	import Education from './_components/education.svelte';
	import Guestbook from './_components/guestbook/guestbook.svelte';
	import Intro from './_components/intro.svelte';
	import Scrolltelling from './_components/scrolltelling.svelte';
	import Skills from './_components/skills.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<SeoHead
	title="Rillah | Software Engineer"
	description="Rillah is a software engineering student crafting scalable, production-ready systems."
	canonical={canonicalUrl('/')}
	jsonLd={[personSchema(), webSiteSchema()]}
/>

<main>
	<Intro />
	<Scrolltelling />
	<About />
	<Skills />
	<Career {careers} />
	<Education {educations} />
	{#await data.github}
		<div class="mt-10 space-y-3">
			<Skeleton class="h-6 w-40" />
			<Skeleton class="h-32 w-full" />
		</div>
	{:then github}
		{#if github}
			<Contribution {github} />
		{:else}
			<div class="mt-10 rounded-none border border-dashed p-6 text-sm text-muted-foreground">
				<p>GitHub contributions unavailable — showing portfolio without activity graph.</p>
			</div>
		{/if}
	{:catch}
		<div class="mt-10 rounded-none border border-dashed p-6 text-sm text-muted-foreground">
			GitHub contributions unavailable.
		</div>
	{/await}
	{#await data.certifications then certifications}
		<Certification {certifications} />
	{/await}
	{#await data.guestbook then guestbook}
		<Guestbook entries={guestbook} />
	{/await}
</main>
