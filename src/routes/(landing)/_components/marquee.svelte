<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		children,
		reverse = false,
		pauseOnHover = false,
		vertical = false,
		repeat = 2,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		reverse?: boolean;
		pauseOnHover?: boolean;
		vertical?: boolean;
		repeat?: number;
	} = $props();
</script>

<div
	class={cn(
		'group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]',
		vertical ? 'flex-col' : 'flex-row',
		className
	)}
	{...restProps}
>
	{#each Array.from({ length: repeat }) as _, i (i)}
		<div
			class={cn(
				'flex shrink-0 justify-around gap-(--gap)',
				vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row',
				pauseOnHover && 'group-hover:paused',
				reverse && 'shimmer-reverse'
			)}
		>
			{@render children?.()}
		</div>
	{/each}
</div>
