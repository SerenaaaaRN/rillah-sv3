<script lang="ts">
	import type { Component } from 'svelte';
	import { Card } from '$lib/components/ui/card/index.js';

	type Props = {
		title: string;
		value: string | number;
		icon: Component;
		href?: string;
	};

	let { title, value, icon: Icon, href }: Props = $props();
</script>

{#snippet body()}
	<div class="flex items-center gap-3">
		<Icon class="size-5 shrink-0 text-muted-foreground" />
		<div class="min-w-0">
			<p class="truncate text-sm text-muted-foreground">{title}</p>
			<p class="text-2xl font-bold">{value}</p>
		</div>
	</div>
{/snippet}

{#if href}
	<a {href} class="block h-full outline-none">
		<Card class="h-full rounded-none p-4 transition-colors hover:border-foreground/20">
			{@render body()}
		</Card>
	</a>
{:else}
	<Card class="h-full rounded-none p-4">
		{@render body()}
	</Card>
{/if}
