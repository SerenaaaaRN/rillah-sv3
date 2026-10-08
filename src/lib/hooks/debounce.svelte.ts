/**
 * Debounce a reactive source.
 *
 * Takes a getter so `$effect` tracks the value reactively.
 * The previous implementation took `value` by-copy, so the
 * effect never re-ran when the source changed.
 */
export const debounce = <T>(source: () => T, delayMs = 300): { readonly current: T } => {
	let current = $state<T>(source());
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		const value = source();
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			current = value;
		}, delayMs);
		return () => clearTimeout(timeoutId);
	});

	return {
		get current() {
			return current;
		}
	};
};
