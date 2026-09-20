<script lang="ts">
	import BlurFade from '$lib/components/shared/blur-fade.svelte';
	import MacWindow from '$lib/components/shared/mac-window.svelte';
	import * as SectionHeading from '$lib/components/shared/section-heading/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import ProjectCard from './_components/project-card.svelte';
	import ProjectsToolbar, { type SortOption } from './_components/projects-toolbar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const projects = $derived(data.projects);

	let search = $state('');
	let sortBy: SortOption = $state('newest');

	const filteredProjects = $derived.by(() => {
		let result = projects;
		const q = search.trim().toLowerCase();
		if (q) {
			result = result.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					(p.description?.toLowerCase().includes(q) ?? false) ||
					(p.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
			);
		}
		return [...result].sort((a, b) =>
			sortBy === 'title'
				? a.title.localeCompare(b.title)
				: new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
		);
	});

	const hasActiveQuery = $derived(search.trim() !== '' || sortBy !== 'newest');

	function clearSearch() {
		search = '';
		sortBy = 'newest';
	}
</script>

<svelte:head>
	<title>Selected projects — Rillah</title>
	<meta
		name="description"
		content="Selected projects — from basic websites to advanced web applications."
	/>
</svelte:head>

<BlurFade delay={0.25} inView>
	<SectionHeading.Root class="mb-8">
		<SectionHeading.Eyebrow>Work</SectionHeading.Eyebrow>
		<SectionHeading.Title
			>Selected <SectionHeading.Accent>projects</SectionHeading.Accent></SectionHeading.Title
		>
		<SectionHeading.Description
			>I have experience working on a wide range of projects, from basic websites to advanced web
			applications.</SectionHeading.Description
		>
	</SectionHeading.Root>
	<MacWindow title="~/projects">
		<ProjectsToolbar
			bind:search
			bind:sortBy
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
