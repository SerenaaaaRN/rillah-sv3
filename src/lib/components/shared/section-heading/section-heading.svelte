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

	export type SectionHeadingAlign = 'left' | 'center';

	export const SECTION_HEADING_ALIGN_KEY = 'section-heading:align';
</script>

<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		align = 'left',
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		align?: SectionHeadingAlign;
		children?: Snippet;
	} = $props();

	setContext(SECTION_HEADING_ALIGN_KEY, {
		get align() {
			return align;
		}
	});
</script>

<div
	bind:this={ref}
	data-slot="section-heading"
	class={cn(sectionHeadingVariants({ align }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
