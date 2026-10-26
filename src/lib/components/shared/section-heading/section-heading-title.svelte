<script lang="ts" module>
	import { tv } from 'tailwind-variants';

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

	export type SectionHeadingAs = 'h1' | 'h2' | 'h3';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		as = 'h2' as SectionHeadingAs,
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLHeadingElement>> & {
		as?: SectionHeadingAs;
		children?: Snippet;
	} = $props();
</script>

<svelte:element
	this={as}
	bind:this={ref}
	data-slot="section-heading-title"
	class={cn(sectionTitleVariants({ as }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
