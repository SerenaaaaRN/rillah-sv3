<script lang="ts">
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
	const isValidUrl = (url: string) => url !== '' && (url.startsWith('/') || url.startsWith('http'));

	const hasVideo = $derived(isValidUrl(video));
	const thumbnail = $derived(project.images[0] ?? project.image ?? '');
	const hasImage = $derived(isValidUrl(thumbnail) && thumbnail !== '/no-image.jpg');

	const visibleTags = $derived(project.tags.slice(0, 3));
	const hiddenTagCount = $derived(Math.max(0, project.tags.length - 3));

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
		<div class="relative h-44 w-full overflow-hidden bg-muted">
			{#if hasVideo}
				<video src={video} autoplay muted loop playsinline poster={hasImage ? thumbnail : undefined}
				></video>
			{:else if hasImage}
				<img src={thumbnail} alt={project.title} loading="lazy" />
			{/if}
		</div>

		<CardHeader class="space-y-1.5 p-4 pb-2">
			<CardTitle
				class="line-clamp-2 font-display text-base font-bold tracking-tight transition-colors group-hover:text-primary sm:text-lg"
			>
				{project.title || 'Untitled'}
			</CardTitle>
			<p
				class="line-clamp-2 font-sans text-xs leading-snug text-pretty text-muted-foreground sm:text-sm"
			>
				{toPlainText(project.description)}
			</p>
		</CardHeader>

		{#if project.tags.length > 0}
			<CardContent class="px-4 pt-0 pb-2">
				<ul class="flex flex-wrap gap-1.5">
					{#each visibleTags as tag, idx (tag + idx)}
						<li>
							<Badge variant="outline" class="rounded-none text-[11px]">{tag}</Badge>
						</li>
					{/each}
					{#if hiddenTagCount > 0}
						<li>
							<Badge variant="outline" class="rounded-none text-[11px]">+{hiddenTagCount}</Badge>
						</li>
					{/if}
				</ul>
			</CardContent>
		{/if}
	</a>

	<CardFooter class="gap-2">
		{#if project.url}
			<Button
				href={project.url}
				target="_blank"
				size="sm"
				variant="secondary"
				class="h-8 gap-1.5 rounded-md hover:bg-primary hover:text-primary-foreground"
			>
				<Globe class="size-3.5" />
				<span class="font-mono text-[11px] font-medium tracking-wider uppercase">Website</span>
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
				<span class="font-mono text-[11px] font-medium tracking-wider uppercase">Source</span>
			</Button>
		{/if}
	</CardFooter>
</Card>
