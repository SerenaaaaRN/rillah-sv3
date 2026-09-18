<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { careers } from '$lib/data/career.js';
	import { educations } from '$lib/data/education.js';
	import About from './_components/about.svelte';
	import Career from './_components/career.svelte';
	import Certification from './_components/certification/certification.svelte';
	import Contribution from './_components/contribution/contribution.svelte';
	import Education from './_components/education.svelte';
	import Guestbook from './_components/guestbook/guestbook.svelte';
	import Intro from './_components/intro.svelte';
	import Skills from './_components/skills.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Rillah | AI Engineer</title>
	<meta
		name="description"
		content="Rillah is a AI Engineer building production LLM systems — RAG, MCP, and cloud-native agents."
	/>
</svelte:head>

<main>
	<Intro />
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
	<Certification certifications={data.certifications} />
	<Guestbook entries={data.guestbook} />
</main>
