<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
		children?: Snippet;
	} = $props();
</script>

<span
	bind:this={ref}
	data-slot="section-heading-accent"
	class={cn('font-serif font-normal tracking-normal text-primary italic', className)}
	{...restProps}
>
	{@render children?.()}
</span>
