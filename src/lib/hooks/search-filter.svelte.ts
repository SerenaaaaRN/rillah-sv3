import { debounce } from './debounce.svelte.js';

export interface SearchFilterOptions<T> {
	items: T[] | (() => T[]);
	filterFn: (item: T, query: string) => boolean;
	debounceMs?: number;
}

export const searchFilter = <T>({ items, filterFn, debounceMs = 300 }: SearchFilterOptions<T>) => {
	let query = $state('');
	const debounced = debounce(() => query, debounceMs);

	const resolveItems = (): T[] => (typeof items === 'function' ? (items as () => T[])() : items);

	const filteredItems = $derived.by(() => {
		const list = resolveItems();
		const q = debounced.current.trim();
		if (q === '') return list;
		const lowered = q.toLowerCase();
		return list.filter((item) => filterFn(item, lowered));
	});

	const isEmpty = $derived(filteredItems.length === 0);
	const isSearching = $derived(query !== debounced.current);

	return {
		get query() {
			return query;
		},
		set query(v: string) {
			query = v;
		},
		get debouncedQuery() {
			return debounced.current;
		},
		get filteredItems() {
			return filteredItems;
		},
		get isEmpty() {
			return isEmpty;
		},
		get isSearching() {
			return isSearching;
		},
		clear() {
			query = '';
		}
	};
};
