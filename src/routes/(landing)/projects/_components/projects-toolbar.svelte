<script lang="ts" module>
	export type SortOption = 'newest' | 'title';
</script>

<script lang="ts">
	import FilterToolbar from '#lib/components/shared/filter-toolbar.svelte';

	let {
		search = $bindable(''),
		selectedCategory = $bindable('All'),
		sortBy = $bindable<SortOption>('newest'),
		categories = [],
		total,
		count
	}: {
		search?: string;
		selectedCategory?: string;
		sortBy?: SortOption;
		categories?: string[];
		total: number;
		count: number;
	} = $props();

	const sortOptions = [
		{ value: 'newest', label: 'Newest' },
		{ value: 'title', label: 'Name' }
	] as const;
</script>

<FilterToolbar
	bind:search
	bind:filter={selectedCategory}
	bind:sortBy
	options={categories}
	sortOptions={sortOptions.slice()}
	placeholder="Search projects..."
	allLabel="All Categories"
	filterLabel="Filter by category"
	countLabel="Sort projects"
	{total}
	{count}
/>
