<script lang="ts">
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import * as Select from '#lib/components/ui/select/index.js';

	let {
		search = $bindable(''),
		filter = $bindable('All'),
		sortBy = $bindable(''),
		options = [],
		sortOptions = [],
		placeholder,
		allLabel,
		filterLabel,
		countLabel,
		total,
		count
	}: {
		search?: string;
		filter?: string;
		sortBy?: string;
		options?: string[];
		sortOptions?: { value: string; label: string }[];
		placeholder: string;
		allLabel: string;
		filterLabel: string;
		countLabel: string;
		total: number;
		count: number;
	} = $props();
</script>

<div role="search" class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
	<div class="flex max-w-2xl flex-1 flex-col gap-3 sm:flex-row sm:items-center">
		<div class="relative flex-1">
			<MagnifyingGlass
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input
				type="search"
				{placeholder}
				bind:value={search}
				class="pl-9"
				aria-label={placeholder}
			/>
		</div>

		<Select.Root type="single" bind:value={filter}>
			<Select.Trigger class="w-full sm:w-45" aria-label={filterLabel}>
				<Select.Value placeholder={allLabel} />
			</Select.Trigger>
			<Select.Content class="max-h-80 overflow-y-auto">
				<Select.Group>
					{#each options as option (option)}
						<Select.Item value={option} label={option === 'All' ? allLabel : option}>
							{option === 'All' ? allLabel : option}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
		<Badge variant="outline">
			{count} / {total}
		</Badge>

		<div class="inline-flex flex-wrap gap-1" role="group" aria-label={countLabel}>
			{#each sortOptions as opt (opt.value)}
				<Button
					type="button"
					variant={sortBy === opt.value ? 'default' : 'outline'}
					size="sm"
					onclick={() => (sortBy = opt.value)}
					aria-pressed={sortBy === opt.value}
				>
					{opt.label}
				</Button>
			{/each}
		</div>
	</div>
</div>
