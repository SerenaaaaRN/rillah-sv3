<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	export const surfaceVariants = tv({
		base: '',
		variants: {
			variant: {
				solid:
					'rounded-none border border-border bg-card text-card-foreground shadow-sm transition-colors hover:border-foreground/20',
				glass: 'rounded-none border border-border/60 bg-background/40 shadow-sm backdrop-blur-sm',
				'glass-static': 'rounded-none border border-border/60 bg-background/40 shadow-sm',
				inset: 'rounded-none border border-border/40 bg-secondary/20'
			},
			padding: {
				none: '',
				default: 'p-6',
				compact: 'p-4',
				cozy: 'p-5'
			}
		},
		defaultVariants: {
			variant: 'solid',
			padding: 'none'
		}
	});

	export type SurfaceVariant = VariantProps<typeof surfaceVariants>['variant'];
	export type SurfacePadding = VariantProps<typeof surfaceVariants>['padding'];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'solid',
		padding = 'none',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: SurfaceVariant;
		padding?: SurfacePadding;
		children?: Snippet;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="surface"
	data-variant={variant}
	class={cn(surfaceVariants({ variant, padding }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
