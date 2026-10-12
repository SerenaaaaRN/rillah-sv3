<script lang="ts">
	import SealCheck from 'phosphor-svelte/lib/SealCheck';
	import { cn } from '$lib/utils.js';

	let {
		avatar,
		name,
		handle,
		compact = false
	}: {
		avatar: string;
		name: string;
		handle: string;
		compact?: boolean;
	} = $props();
</script>

<div
	data-slot="profile-header"
	class={cn(!compact && 'mb-3 px-1', compact && 'mb-4 flex items-center gap-4')}
>
	<img
		src={avatar}
		alt={name}
		width={compact ? 64 : 100}
		height={compact ? 64 : 100}
		loading="eager"
		fetchpriority="high"
		decoding="async"
		class={cn(
			'shrink-0 rounded-full object-cover ring-1 ring-border',
			compact ? 'size-16!' : 'relative mb-3 size-25!'
		)}
	/>
	<div class={cn('space-y-1', compact && 'flex-1')}>
		{#if compact}
			<h4 class="flex items-center gap-2 font-display text-base font-bold">
				{name}
				<SealCheck size={14} class="text-primary" />
			</h4>
		{:else}
			<h2 class="flex items-center font-display text-xl font-bold tracking-tight">
				{name}
				<SealCheck size={18} class="ml-2 text-primary" aria-label="Verified" />
			</h2>
		{/if}
		<div class="flex items-center gap-2">
			<div class="flex items-center gap-2">
				<span class="relative flex h-2 w-2" role="status" aria-label="Online">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"
					></span>
					<span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
				</span>
				<p class="text-xs font-medium text-green-700 dark:text-green-500">Online</p>
			</div>
			<p class="text-xs text-primary/55">{handle}</p>
		</div>
	</div>
</div>
