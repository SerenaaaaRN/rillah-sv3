<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils.js';

	let {
		class: className,
		children,
		reverse = false,
		pauseOnHover = false,
		vertical = false,
		repeat = 2,
		duration = '40s',
		gap = '1rem',
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		reverse?: boolean;
		pauseOnHover?: boolean;
		vertical?: boolean;
		repeat?: number;
		duration?: string;
		gap?: string;
	} = $props();

	const repeatList = $derived(Array.from({ length: Math.max(1, repeat) }, (_, index) => index));
</script>

<div
	class={cn(
		'group flex gap-(--gap) overflow-hidden p-2',
		vertical ? 'flex-col' : 'flex-row',
		className
	)}
	style:--duration={duration}
	style:--gap={gap}
	{...restProps}
>
	{#each repeatList as index (index)}
		<div
			class={cn(
				'flex shrink-0 justify-around gap-(--gap) motion-reduce:animate-none',
				vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
				pauseOnHover && 'group-hover:paused',
				reverse && 'shimmer-reverse'
			)}
			aria-hidden={index > 0 ? 'true' : undefined}
			inert={index > 0 ? true : undefined}
		>
			{@render children?.()}
		</div>
	{/each}
</div>
