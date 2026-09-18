<script lang="ts">
	import ArrowsOut from 'phosphor-svelte/lib/ArrowsOut';
	import SealCheck from 'phosphor-svelte/lib/SealCheck';
	import { Card } from '$lib/components/ui/card/index.js';
	import type { Certificate } from '$lib/schema/certificate.js';
	import { cn } from '$lib/utils.js';

	let {
		cert,
		onclick
	}: {
		cert: Certificate;
		onclick: () => void;
	} = $props();

	const hasImage = $derived(cert.image_url.trim().length > 0);
</script>

<Card
	{onclick}
	class={cn(
		'group flex cursor-pointer flex-col rounded-none border border-border p-3 transition-colors hover:border-foreground/20',
		!hasImage && 'cursor-default opacity-80'
	)}
>
	<figure class="relative aspect-16/11 w-full shrink-0 overflow-hidden bg-muted/40 select-none">
		{#if hasImage}
			<img
				src={cert.image_url}
				alt={cert.title}
				loading="lazy"
				class="h-full w-full object-cover"
			/>
			<div
				class="absolute inset-0 flex items-center justify-center bg-foreground/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				aria-hidden="true"
			>
				<div class="rounded-full border border-white/20 bg-background/10 p-3 backdrop-blur-md">
					<ArrowsOut class="size-4.5 text-primary-foreground" />
				</div>
			</div>
		{:else}
			<div class="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
				<SealCheck class="size-9" stroke-width={1.25} aria-hidden="true" />
			</div>
		{/if}
		{#if !hasImage}
			<figcaption class="sr-only">No certificate image available</figcaption>
		{/if}
	</figure>

	<footer class="flex flex-1 flex-col justify-between px-2 pt-4 pb-1.5">
		<h3 class="mb-3 font-display text-sm leading-snug font-bold tracking-tight">
			{cert.title}
		</h3>
		<div class="flex items-center justify-between gap-3 pt-1">
			<p
				class="max-w-[70%] truncate font-mono text-[10px] tracking-wider text-muted-foreground uppercase"
			>
				{cert.issuer}
			</p>
			<time class="shrink-0 font-mono text-[9px] text-muted-foreground">{cert.date}</time>
		</div>
	</footer>
</Card>
