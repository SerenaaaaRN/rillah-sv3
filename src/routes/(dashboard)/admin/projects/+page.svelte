<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card } from '$lib/components/ui/card/index.js';
	import FolderOpen from 'phosphor-svelte/lib/FolderOpen';
	import Plus from 'phosphor-svelte/lib/Plus';
	import type { PageData } from './$types.js';
	import ProjectsTable from './_components/projects-table.svelte';

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

	{#if totalProjects === 0}
		<section aria-label="Project statistics" class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<Card class="rounded-none p-4"
				><div class="flex items-center gap-3">
					<FolderOpen class="size-5 text-muted-foreground" />
					<div>
						<p class="text-sm text-muted-foreground">Total Projects</p>
						<p class="text-2xl font-bold">0</p>
					</div>
				</div></Card
			>
			<Card class="rounded-none p-4"
				><div class="flex items-center gap-3">
					<FolderOpen class="size-5 text-muted-foreground" />
					<div>
						<p class="text-sm text-muted-foreground">With Demo</p>
						<p class="text-2xl font-bold">0</p>
					</div>
				</div></Card
			>
			<Card class="rounded-none p-4"
				><div class="flex items-center gap-3">
					<FolderOpen class="size-5 text-muted-foreground" />
					<div>
						<p class="text-sm text-muted-foreground">Total Tags</p>
						<p class="text-2xl font-bold">0</p>
					</div>
				</div></Card
			>
		</section>
		<div class="rounded-none border border-dashed border-border p-8 text-center">
			<p class="text-sm text-muted-foreground">No projects yet</p>
			<Button size="sm" href="/admin/projects/new" class="mt-3">Create your first project →</Button>
		</div>
	{:else}
		<section aria-label="Project statistics" class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<Card class="rounded-none p-4"
				><div class="flex items-center gap-3">
					<FolderOpen class="size-5 text-muted-foreground" />
					<div>
						<p class="text-sm text-muted-foreground">Total Projects</p>
						<p class="text-2xl font-bold">{totalProjects}</p>
					</div>
				</div></Card
			>
			<Card class="rounded-none p-4"
				><div class="flex items-center gap-3">
					<FolderOpen class="size-5 text-muted-foreground" />
					<div>
						<p class="text-sm text-muted-foreground">With Demo</p>
						<p class="text-2xl font-bold">{withDemoCount}</p>
					</div>
				</div></Card
			>
			<Card class="rounded-none p-4"
				><div class="flex items-center gap-3">
					<FolderOpen class="size-5 text-muted-foreground" />
					<div>
						<p class="text-sm text-muted-foreground">Total Tags</p>
						<p class="text-2xl font-bold">{totalTags}</p>
					</div>
				</div></Card
			>
		</section>
		<ProjectsTable {projects} />
	{/if}
</div>
