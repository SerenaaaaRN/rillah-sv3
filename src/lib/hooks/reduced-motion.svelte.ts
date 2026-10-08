import { MediaQuery } from 'svelte/reactivity';

/**
 * Reactive `prefers-reduced-motion` media query.
 * SSR-safe — mirrors the `IsMobile` pattern.
 *
 * Usage:
 * ```svelte
 * <script>
 * 	import { ReducedMotion } from '$lib/hooks/reduced-motion.svelte.js';
 * 	const reducedMotion = new ReducedMotion();
 * </script>
 *
 * {#if !reducedMotion.current}...{/if}
 * ```
 */
export class ReducedMotion extends MediaQuery {
	constructor() {
		super('(prefers-reduced-motion: reduce)');
	}
}
