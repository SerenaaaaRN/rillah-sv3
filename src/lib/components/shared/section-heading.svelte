<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	export const sectionHeadingVariants = tv({
		base: 'flex flex-col gap-2',
		variants: {
			align: {
				left: '',
				center: 'items-center text-center'
			}
		},
		defaultVariants: {
			align: 'left'
		}
	});

	export const sectionTitleVariants = tv({
		base: 'font-display font-bold leading-[1.05] tracking-tight text-balance',
		variants: {
			as: {
				h1: 'text-3xl sm:text-4xl md:text-5xl',
				h2: 'text-2xl sm:text-3xl',
				h3: 'text-2xl sm:text-3xl'
			}
		},
		defaultVariants: {
			as: 'h2'
		}
	});
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import Eyebrow from '$lib/components/shared/eyebrow.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type HeadingAs = 'h1' | 'h2' | 'h3';

	let {
		ref = $bindable(null),
		eyebrow,
		marker,
		title,
		accent,
		description,
		align = 'left',
		as = 'h2' as HeadingAs,
		class: className,
		titleClass,
		children,
		eyebrowSnippet,
		titleSnippet,
		accentSnippet,
		descriptionSnippet,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		eyebrow?: string;
		marker?: string | number;
		title?: string;
		accent?: string;
		description?: string;
		align?: 'left' | 'center';
		as?: HeadingAs;
		class?: string;
		titleClass?: string;
		children?: Snippet;
		eyebrowSnippet?: Snippet;
		titleSnippet?: Snippet;
		accentSnippet?: Snippet;
		descriptionSnippet?: Snippet;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="section-heading"
	class={cn(sectionHeadingVariants({ align }), className)}
	{...restProps}
>
	{#if eyebrow || eyebrowSnippet}
		<Eyebrow {marker}>
			{#if eyebrowSnippet}
				{@render eyebrowSnippet()}
			{:else}
				{eyebrow}
			{/if}
		</Eyebrow>
	{/if}

	<svelte:element this={as} class={cn(sectionTitleVariants({ as }), titleClass)}>
		{#if titleSnippet}
			{@render titleSnippet()}
		{:else}{title}{/if}{#if accentSnippet}<span
				class="font-serif font-normal tracking-normal text-primary italic"
			>
				&#32;{@render accentSnippet()}</span
			>{:else if accent}<span class="font-serif font-normal tracking-normal text-primary italic">
				&#32;{accent}</span
			>{/if}
	</svelte:element>

	{#if description || descriptionSnippet}
		<p
			class={cn(
				'max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm',
				align === 'center' && 'mx-auto'
			)}
		>
			{#if descriptionSnippet}
				{@render descriptionSnippet()}
			{:else}
				{description}
			{/if}
		</p>
	{/if}

	{#if children}
		{@render children()}
	{/if}
</div>
