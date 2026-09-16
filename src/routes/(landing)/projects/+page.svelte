<script lang="ts">
	import FolderOpen from 'phosphor-svelte/lib/FolderOpen';
	import GitBranch from 'phosphor-svelte/lib/GitBranch';
	import Globe from 'phosphor-svelte/lib/Globe';
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
	import BlurFade from '$lib/components/shared/blur-fade.svelte';
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import MacWindow from '$lib/components/shared/mac-window.svelte';
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const projects = $derived(data.projects);

	type SortOption = 'newest' | 'title';

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

	const sortOptions: { value: SortOption; label: string }[] = [
		{ value: 'newest', label: 'Newest' },
		{ value: 'title', label: 'Name' }
	];

	function toPlainText(html: string): string {
		return html
			.replace(/<\/?[^>]+(>|$)/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();
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
	<SectionHeading
		as="h1"
		eyebrow="Work"
		title="Selected"
		accent="projects"
		description="I have experience working on a wide range of projects, from basic websites to advanced web applications."
		class="mb-8"
	/>
	<MacWindow title="~/projects">
		<div
			role="search"
			class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="relative max-w-md flex-1">
				<MagnifyingGlass
					class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<Input
					type="search"
					placeholder="Search projects..."
					bind:value={search}
					class="pl-9"
					aria-label="Search projects"
				/>
			</div>

			<div class="flex items-center justify-between gap-4">
				<Badge variant="outline">
					{filteredProjects.length} / {projects.length}
				</Badge>

				<div class="inline-flex flex-wrap gap-1" role="group" aria-label="Sort projects">
					{#each sortOptions as opt (opt.value)}
						<Button
							type="button"
							variant={sortBy === opt.value ? 'default' : 'outline'}
							size="sm"
							onclick={() => (sortBy = opt.value)}
							aria-pressed={sortBy === opt.value}
						>
							{opt.label}
						</Button>
					{/each}
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredProjects as project (project.id)}
				{@const video = project.video}
				{@const hasVideo = video !== '' && (video.startsWith('/') || video.startsWith('http'))}
				{@const thumbnail = project.images[0] ?? project.image ?? ''}
				{@const hasImage =
					thumbnail !== '' &&
					thumbnail !== '/no-image.jpg' &&
					(thumbnail.startsWith('/') ||
						thumbnail.startsWith('http') ||
						thumbnail.startsWith('https'))}
				{@const tags = project.tags}
				<Card
					class="group flex h-full flex-col overflow-hidden transition-colors hover:border-foreground/20"
				>
					<a
						href="/projects/{project.slug || project.id}"
						data-sveltekit-preload-code="viewport"
						data-sveltekit-preload-data="hover"
						class="block overflow-hidden"
					>
						{#if hasVideo}
							<div class="relative h-44 w-full overflow-hidden bg-muted">
								<video
									src={video}
									autoplay
									muted
									loop
									playsinline
									poster={hasImage ? thumbnail : undefined}
									class="h-full w-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105"
								></video>
								<div
									class="absolute inset-0 bg-linear-to-t from-background/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								></div>
							</div>
						{:else if hasImage}
							<div class="relative h-44 w-full overflow-hidden bg-muted">
								<img
									src={thumbnail}
									alt={project.title}
									class="h-full w-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105"
								/>
								<div
									class="absolute inset-0 bg-linear-to-t from-background/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								></div>
							</div>
						{:else}
							<div
								class="relative h-44 w-full overflow-hidden bg-linear-to-br from-primary/15 via-primary/5 to-background"
							>
								<div
									class="absolute inset-0 opacity-50"
									style="background-image: radial-gradient(circle, hsl(var(--primary) / 0.15) 1px, transparent 1px); background-size: 14px 14px;"
								></div>
								<span
									class="pointer-events-none absolute -right-1 -bottom-6 text-[7rem] leading-none font-black text-primary/10 select-none"
									>{project.title.charAt(0).toUpperCase()}</span
								>
								<div class="absolute inset-0 flex items-center justify-center">
									<div
										class="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-background/60 shadow-sm backdrop-blur-sm transition-transform duration-500 group-hover:scale-110"
									>
										<FolderOpen class="h-7 w-7 text-primary/70" />
									</div>
								</div>
							</div>
						{/if}
						<CardHeader class="space-y-1.5 p-4 pb-2">
							<CardTitle
								class="line-clamp-2 font-display text-base font-bold tracking-tight transition-colors group-hover:text-primary sm:text-lg"
								>{project.title || 'Untitled'}</CardTitle
							>
							<p
								class="line-clamp-2 font-sans text-xs leading-snug text-pretty text-muted-foreground sm:text-sm"
							>
								{toPlainText(project.description)}
							</p>
						</CardHeader>
						{#if tags.length > 0}
							<CardContent class="px-4 pt-0 pb-2">
								<ul class="flex flex-wrap gap-1.5">
									{#each tags.slice(0, 3) as tag, idx (tag + idx)}
										<li><Badge variant="outline" class="rounded-none text-[10px]">{tag}</Badge></li>
									{/each}
									{#if tags.length > 3}
										<li>
											<Badge variant="outline" class="rounded-none text-[10px]"
												>+{tags.length - 3}</Badge
											>
										</li>
									{/if}
								</ul>
							</CardContent>
						{/if}
					</a>
					<CardFooter class="mt-auto border-t border-border p-4 pt-4">
						<div class="flex flex-row flex-wrap items-center gap-2">
							{#if project.url}
								<Button
									href={project.url}
									target="_blank"
									size="sm"
									variant="secondary"
									class="h-8 gap-1.5 rounded-md hover:bg-primary hover:text-primary-foreground"
								>
									<Globe class="size-3.5" />
									<span class="font-mono text-[10px] font-medium tracking-wider uppercase"
										>Website</span
									>
								</Button>
							{/if}
							{#if project.source_code}
								<Button
									href={project.source_code}
									target="_blank"
									size="sm"
									variant="outline"
									class="h-8 gap-1.5 rounded-md hover:bg-primary/10"
								>
									<GitBranch class="size-3.5" />
									<span class="font-mono text-[10px] font-medium tracking-wider uppercase"
										>Source</span
									>
								</Button>
							{/if}
						</div>
					</CardFooter>
				</Card>
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
