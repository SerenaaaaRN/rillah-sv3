<script lang="ts">
	import FolderOpen from 'phosphor-svelte/lib/FolderOpen';
	import GitBranch from 'phosphor-svelte/lib/GitBranch';
	import Globe from 'phosphor-svelte/lib/Globe';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import type { ProjectCard } from '$lib/schema/projects.js';

	let { project }: { project: ProjectCard } = $props();

	const video = $derived(project.video);
	const hasVideo = $derived(video !== '' && (video.startsWith('/') || video.startsWith('http')));
	const thumbnail = $derived(project.images[0] ?? project.image ?? '');
	const hasImage = $derived(
		thumbnail !== '' &&
			thumbnail !== '/no-image.jpg' &&
			(thumbnail.startsWith('/') || thumbnail.startsWith('http') || thumbnail.startsWith('https'))
	);

	function toPlainText(html: string): string {
		return html
			.replace(/<\/?[^>]+(>|$)/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();
	}
</script>

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
					loading="lazy"
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
		{#if project.tags.length > 0}
			<CardContent class="px-4 pt-0 pb-2">
				<ul class="flex flex-wrap gap-1.5">
					{#each project.tags.slice(0, 3) as tag, idx (tag + idx)}
						<li><Badge variant="outline" class="rounded-none text-[10px]">{tag}</Badge></li>
					{/each}
					{#if project.tags.length > 3}
						<li>
							<Badge variant="outline" class="rounded-none text-[10px]"
								>+{project.tags.length - 3}</Badge
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
					<span class="font-mono text-[10px] font-medium tracking-wider uppercase">Website</span>
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
					<span class="font-mono text-[10px] font-medium tracking-wider uppercase">Source</span>
				</Button>
			{/if}
		</div>
	</CardFooter>
</Card>
