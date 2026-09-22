<script lang="ts">
	import Article from 'phosphor-svelte/lib/Article';
	import BlurFade from '$lib/components/shared/blur-fade.svelte';
	import MacWindow from '$lib/components/shared/mac-window.svelte';
	import * as SectionHeading from '$lib/components/shared/section-heading/index.js';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { canonicalUrl } from '$lib/seo/site.js';
</script>

<SeoHead
	title="Blog & notes — Rillah"
	description="I write about my experiences, thoughts, and ideas on various topics."
	canonical={canonicalUrl('/blog')}
	noindex
/>

<BlurFade delay={0.25} inView>
	<SectionHeading.Root class="mb-8">
		<SectionHeading.Eyebrow>Writing</SectionHeading.Eyebrow>
		<SectionHeading.Title as="h1">
			Blog <SectionHeading.Accent>& notes</SectionHeading.Accent>
		</SectionHeading.Title>
		<SectionHeading.Description>
			I write about my experiences, thoughts, and ideas on various topics.
		</SectionHeading.Description>
	</SectionHeading.Root>

	<MacWindow title="~/blog">
		<div class="flex flex-col items-center gap-3 py-12 text-center">
			<Article class="size-8 text-muted-foreground" stroke-width={1.25} aria-hidden="true" />
			<p class="text-sm text-muted-foreground">No posts published yet. Check back soon.</p>
		</div>
	</MacWindow>
</BlurFade>
