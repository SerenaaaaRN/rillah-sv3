<script lang="ts" module>
	import { tv } from 'tailwind-variants';

	export const eyebrowVariants = tv({
		base: 'flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground',
		variants: {},
		defaultVariants: {}
	});
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		marker,
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> & {
		marker?: string | number;
		children?: Snippet;
	} = $props();
</script>

<p bind:this={ref} data-slot="eyebrow" class={cn(eyebrowVariants(), className)} {...restProps}>
	{#if marker !== undefined && marker !== null}
		<span class="font-display text-base font-bold tracking-normal text-primary not-italic"
			>{marker}</span
		>
	{/if}
	{@render children?.()}
</p>
