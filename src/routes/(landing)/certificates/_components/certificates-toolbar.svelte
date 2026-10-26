<script lang="ts" module>
	export type SortOption = 'highlight' | 'timeline';
</script>

<script lang="ts">
	import FilterToolbar from '#lib/components/shared/filter-toolbar.svelte';

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

	const sortOptions = [
		{ value: 'highlight', label: 'Highlight' },
		{ value: 'timeline', label: 'Timeline' }
	] as const;
</script>

<FilterToolbar
	bind:search
	bind:filter={selectedIssuer}
	bind:sortBy
	options={issuers}
	sortOptions={sortOptions.slice()}
	placeholder="Search certificates..."
	allLabel="All Issuers"
	filterLabel="Filter by issuer"
	countLabel="Sort certificates"
	{total}
	{count}
/>
