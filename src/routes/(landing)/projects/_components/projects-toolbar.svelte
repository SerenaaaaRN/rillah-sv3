<script lang="ts" module>
	export type SortOption = 'newest' | 'title';
</script>

<script lang="ts">
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let {
		search = $bindable(''),
		sortBy = $bindable<SortOption>('newest'),
		total,
		count
	}: {
		search?: string;
		sortBy?: SortOption;
		total: number;
		count: number;
	} = $props();

	const sortOptions: { value: SortOption; label: string }[] = [
		{ value: 'newest', label: 'Newest' },
		{ value: 'title', label: 'Name' }
	];
</script>

<div role="search" class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
	<div class="relative max-w-md flex-1">
		<MagnifyingGlass
			class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
		/>
		<Input
			type="search"
			placeholder="Search projects..."
			bind:value={search}
			class="pl-9"
			aria-label="Search projects"
		/>
	</div>

	<div class="flex items-center justify-between gap-4">
		<Badge variant="outline">
			{count} / {total}
		</Badge>

		<div class="inline-flex flex-wrap gap-1" role="group" aria-label="Sort projects">
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
