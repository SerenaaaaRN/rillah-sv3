<script lang="ts">
	import FolderOpen from 'phosphor-svelte/lib/FolderOpen';
	import Plus from 'phosphor-svelte/lib/Plus';
	import StatCard from '$lib/components/shared/stat-card.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import ProjectsTable from './_components/projects-table.svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
	let projects = $derived((data.projects ?? []) as import('$lib/schema/projects.js').Project[]);

	let totalProjects = $derived(projects.length);
	let withDemoCount = $derived(projects.filter((p) => p.demo).length);
	let totalTags = $derived(new Set(projects.flatMap((p) => p.tags)).size);
</script>

<div class="flex flex-col gap-8">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight">Projects</h2>
			<p class="mt-1 text-sm text-muted-foreground">
				Manage your portfolio projects — add, edit, or remove them.
			</p>
		</div>
		<Button size="sm" href="/admin/projects/new"><Plus class="size-4" />Add New Project</Button>
	</header>

	<section aria-label="Project statistics" class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<StatCard title="Total Projects" value={totalProjects} icon={FolderOpen} />
		<StatCard title="With Demo" value={withDemoCount} icon={FolderOpen} />
		<StatCard title="Total Tags" value={totalTags} icon={FolderOpen} />
	</section>

	{#if totalProjects === 0}
		<div class="rounded-none border border-dashed border-border p-8 text-center">
			<p class="text-sm text-muted-foreground">No projects yet</p>
			<Button size="sm" href="/admin/projects/new" class="mt-3">Create your first project →</Button>
		</div>
	{:else}
		<ProjectsTable {projects} />
	{/if}
</div>
