<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const chipVariants = tv({
		base: 'inline-flex items-center gap-1.5 rounded-none border border-border/70 bg-secondary px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors',
		variants: {
			variant: {
				default: '',
				outline: 'bg-transparent border-border',
				ghost: 'border-transparent bg-transparent'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type ChipVariant = VariantProps<typeof chipVariants>['variant'];
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
		variant?: ChipVariant;
		children?: Snippet;
	} = $props();
</script>

<span
	bind:this={ref}
	data-slot="chip"
	data-variant={variant}
	class={cn(chipVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</span>
