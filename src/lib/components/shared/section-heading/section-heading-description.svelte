<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { SECTION_HEADING_ALIGN_KEY, type SectionHeadingAlign } from './section-heading.svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> & {
		children?: Snippet;
	} = $props();

	const alignContext = getContext<{ align: SectionHeadingAlign }>(SECTION_HEADING_ALIGN_KEY);
	const align = $derived(alignContext?.align ?? 'left');
</script>

<p
	bind:this={ref}
	data-slot="section-heading-description"
	class={cn(
		'max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm',
		align === 'center' && 'mx-auto',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</p>
