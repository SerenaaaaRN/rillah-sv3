<script lang="ts">
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
	import GitBranch from 'phosphor-svelte/lib/GitBranch';
	import Globe from 'phosphor-svelte/lib/Globe';
	import BlurFade from '$lib/components/shared/blur-fade.svelte';
	import MacWindow from '$lib/components/shared/mac-window.svelte';
	import * as SectionHeading from '$lib/components/shared/section-heading/index.js';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import {
		absoluteUrl,
		breadcrumbSchema,
		canonicalUrl,
		creativeWorkSchema
	} from '$lib/seo/site.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
	const title = $derived(project.title ?? 'Untitled');
	const description = $derived(project.description ?? '');
	const images = $derived(project.image ?? []);
	const carouselItems = $derived(images.filter((u) => u && u !== '/no-image.jpg'));
	const slug = $derived(project.slug ?? project.id);
	const canonical = $derived(canonicalUrl(`/projects/${slug}`));
	const ogImage = $derived(absoluteUrl(carouselItems[0]));
</script>

<SeoHead
	{title}
	{description}
	{canonical}
	type="article"
	image={ogImage}
	jsonLd={[
		breadcrumbSchema([
			{ name: 'Home', url: canonicalUrl('/') },
			{ name: 'Projects', url: canonicalUrl('/projects') },
			{ name: title, url: canonical }
		]),
		creativeWorkSchema({
			name: title,
			description,
			url: canonical,
			image: ogImage,
			datePublished: project.created_at,
			dateModified: project.updated_at
		})
	]}
/>

<BlurFade delay={0.1} inView>
	<div class="mb-6">
		<Button
			href="/projects"
			variant="ghost"
			size="sm"
			class="gap-2 rounded-none pl-0"
			data-sveltekit-preload-code="viewport"
			data-sveltekit-preload-data="hover"
		>
			<ArrowLeft class="size-4" />
			Back to projects
		</Button>
	</div>

	<SectionHeading.Root class="mb-8">
		<SectionHeading.Eyebrow>Project</SectionHeading.Eyebrow>
		<SectionHeading.Title as="h1">{title}</SectionHeading.Title>
	</SectionHeading.Root>

	<MacWindow title={`~/projects/${project.slug ?? project.id}`}>
		<div class="space-y-6">
			{#if carouselItems.length > 1}
				<Carousel.Root class="w-full">
					<Carousel.Content>
						{#each carouselItems as url, i (url + i)}
							<Carousel.Item>
								<img
									src={url}
									alt={`${title} ${i + 1}`}
									loading={i === 0 ? 'eager' : 'lazy'}
									fetchpriority={i === 0 ? 'high' : 'auto'}
									decoding="async"
									class="aspect-video w-full rounded-none border border-border object-cover"
								/>
							</Carousel.Item>
						{/each}
					</Carousel.Content>
					<Carousel.Previous class="left-2 rounded-none" />
					<Carousel.Next class="right-2 rounded-none" />
				</Carousel.Root>
			{:else if carouselItems.length === 1}
				<img
					src={carouselItems[0]}
					alt={title}
					loading="eager"
					fetchpriority="high"
					decoding="async"
					class="aspect-video w-full rounded-none border border-border object-cover"
				/>
			{:else}
				<div
					class="flex h-48 w-full items-center justify-center rounded-none border border-border bg-muted/20"
				>
					<p class="font-mono text-xs text-muted-foreground">No image — {title}</p>
				</div>
			{/if}

			{#if project.tags?.length}
				<div class="flex flex-wrap gap-1">
					{#each project.tags as tag (tag)}
						<Badge variant="outline" class="rounded-none text-xs">{tag}</Badge>
					{/each}
				</div>
			{/if}

			<p class="text-sm leading-relaxed text-muted-foreground">{description}</p>

			{#if project.features?.length}
				<ul class="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
					{#each project.features as feat (feat)}
						<li>{feat}</li>
					{/each}
				</ul>
			{/if}

			<div class="flex flex-wrap gap-3">
				{#if project.demo}
					<Button href={project.demo} target="_blank" class="gap-2 rounded-none">
						<Globe class="size-4" />
						Visit Website
					</Button>
				{/if}
				{#if project.github}
					<Button
						href={project.github}
						target="_blank"
						variant="outline"
						class="gap-2 rounded-none"
					>
						<GitBranch class="size-4" />
						View Source
					</Button>
				{/if}
			</div>
		</div>
	</MacWindow>
</BlurFade>
