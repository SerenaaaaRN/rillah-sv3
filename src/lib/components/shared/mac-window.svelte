<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let {
		title,
		children,
		class: className,
		bodyClass,
		backdrop = true,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		title?: string;
		children?: Snippet;
		bodyClass?: string;
		backdrop?: boolean;
	} = $props();
</script>

<div
	class={cn(
		'rounded-none border border-border/60 bg-background/40 shadow-sm',
		backdrop && 'backdrop-blur-sm',
		className
	)}
	{...restProps}
>
	<div
		class="flex items-center gap-3 rounded-t-2xl border-b border-border/60 bg-muted/40 px-4 py-3"
	>
		<div class="flex items-center gap-1.5">
			<span class="h-3 w-3 rounded-full bg-red-400/90"></span>
			<span class="h-3 w-3 rounded-full bg-yellow-400/90"></span>
			<span class="h-3 w-3 rounded-full bg-green-400/90"></span>
		</div>
		{#if title}
			<p class="flex-1 truncate text-center font-mono text-xs text-muted-foreground">
				{title}
			</p>
		{/if}
		<div class="w-11.5 shrink-0" aria-hidden="true"></div>
	</div>
	<div class={cn('p-4 sm:p-6', bodyClass)}>
		{@render children?.()}
	</div>
</div>
