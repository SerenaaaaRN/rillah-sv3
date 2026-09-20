<script lang="ts" module>
	export type SortOption = 'highlight' | 'timeline';
</script>

<script lang="ts">
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	let {
		search = $bindable(''),
		selectedIssuer = $bindable('All'),
		sortBy = $bindable<SortOption>('highlight'),
		issuers = [],
		total,
		count
	}: {
		search?: string;
		selectedIssuer?: string;
		sortBy?: SortOption;
		issuers?: string[];
		total: number;
		count: number;
	} = $props();

	const sortOptions: { value: SortOption; label: string }[] = [
		{ value: 'highlight', label: 'Highlight' },
		{ value: 'timeline', label: 'Timeline' }
	];
</script>

<div role="search" class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
	<div class="flex max-w-2xl flex-1 flex-col gap-3 sm:flex-row sm:items-center">
		<div class="relative flex-1">
			<MagnifyingGlass
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input
				type="search"
				placeholder="Search certificates..."
				bind:value={search}
				class="rounded-none pl-9"
				aria-label="Search certificates"
			/>
		</div>

		<Select.Root type="single" bind:value={selectedIssuer}>
			<Select.Trigger class="w-full rounded-none sm:w-45" aria-label="Filter by issuer">
				<Select.Value placeholder="All Issuers" />
			</Select.Trigger>
			<Select.Content class="max-h-80 overflow-y-auto rounded-none">
				<Select.Group>
					{#each issuers as issuer (issuer)}
						<Select.Item value={issuer} label={issuer === 'All' ? 'All Issuers' : issuer}>
							{issuer === 'All' ? 'All Issuers' : issuer}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex shrink-0 items-center justify-between gap-4 md:justify-end">
		<Badge variant="outline" class="rounded-none">
			{count} / {total}
		</Badge>

		<div class="inline-flex gap-1" role="group" aria-label="Sort certificates">
			{#each sortOptions as opt (opt.value)}
				<Button
					type="button"
					variant={sortBy === opt.value ? 'default' : 'outline'}
					size="sm"
					onclick={() => (sortBy = opt.value)}
					aria-pressed={sortBy === opt.value}
					class="h-8 rounded-none px-3 text-xs capitalize"
				>
					{opt.label}
				</Button>
			{/each}
		</div>
	</div>
</div>
