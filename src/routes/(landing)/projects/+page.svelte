<script lang="ts">
	import BlurFade from '#lib/components/shared/blur-fade.svelte';
	import MacWindow from '#lib/components/shared/mac-window.svelte';
	import * as SectionHeading from '#lib/components/shared/section-heading/index.js';
	import SeoHead from '#lib/components/shared/seo-head.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { searchFilter } from '#lib/hooks/search-filter.svelte.js';
	import { PROJECT_CATEGORIES } from '#lib/schema/projects.js';
	import { breadcrumbSchema, canonicalUrl } from '#lib/seo/site.js';
	import ProjectCard from './_components/project-card.svelte';
	import ProjectsToolbar, { type SortOption } from './_components/projects-toolbar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const projects = $derived(data.projects);

	let sortBy: SortOption = $state('newest');
	let selectedCategory = $state('All');

	const filter = searchFilter({
		items: () => projects,
		filterFn: (p, q) =>
			p.title.toLowerCase().includes(q) ||
			(p.description?.toLowerCase().includes(q) ?? false) ||
			(p.tags?.some((t) => t.toLowerCase().includes(q)) ?? false) ||
			(p.category?.some((c) => c.toLowerCase().includes(q)) ?? false),
		debounceMs: 300
	});

	const filteredProjects = $derived.by(() => {
		const result = filter.filteredItems.filter(
			(p) => selectedCategory === 'All' || p.category.includes(selectedCategory)
		);
		return [...result].sort((a, b) =>
			sortBy === 'title'
				? a.title.localeCompare(b.title)
				: new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
		);
	});

	const hasActiveQuery = $derived(
		filter.query.trim() !== '' || sortBy !== 'newest' || selectedCategory !== 'All'
	);

	const clearSearch = () => {
		filter.clear();
		sortBy = 'newest';
		selectedCategory = 'All';
	};
</script>

<SeoHead
	title="Selected projects — Rillah"
	description="Selected projects by Rillah — from basic websites to advanced web applications, LLM systems, and cloud-native experiments."
	canonical={canonicalUrl('/projects')}
	jsonLd={[
		breadcrumbSchema([
			{ name: 'Home', url: canonicalUrl('/') },
			{ name: 'Projects', url: canonicalUrl('/projects') }
		])
	]}
/>

<BlurFade delay={0.25} inView>
	<SectionHeading.Root class="mb-8">
		<SectionHeading.Eyebrow>Work</SectionHeading.Eyebrow>
		<SectionHeading.Title as="h1"
			>Selected <SectionHeading.Accent>projects</SectionHeading.Accent></SectionHeading.Title
		>
		<SectionHeading.Description
			>I have experience working on a wide range of projects, from basic websites to advanced web
			applications.</SectionHeading.Description
		>
	</SectionHeading.Root>
	<MacWindow title="~/projects">
		<ProjectsToolbar
			bind:search={filter.query}
			bind:selectedCategory
			bind:sortBy
			categories={['All', ...PROJECT_CATEGORIES]}
			total={projects.length}
			count={filteredProjects.length}
		/>

		<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredProjects as project (project.id)}
				<ProjectCard {project} />
			{/each}
		</div>
		{#if projects.length === 0}
			<p class="py-12 text-center text-sm text-muted-foreground">No projects to show yet.</p>
		{:else if filteredProjects.length === 0}
			<div class="flex flex-col items-center gap-2 py-12 text-center">
				<p class="text-sm text-muted-foreground">No projects match your search.</p>
				{#if hasActiveQuery}
					<Button variant="ghost" size="sm" onclick={clearSearch}>Clear search</Button>
				{/if}
			</div>
		{/if}
	</MacWindow>
</BlurFade>
