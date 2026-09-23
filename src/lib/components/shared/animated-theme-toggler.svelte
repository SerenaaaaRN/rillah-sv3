<script lang="ts">
	import { mode, toggleMode } from 'mode-watcher';
	import Moon from 'phosphor-svelte/lib/Moon';
	import Sun from 'phosphor-svelte/lib/Sun';
	import { untrack } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		duration?: number;
		fromCenter?: boolean;
		showLabel?: boolean;
	}

	let {
		duration = 400,
		fromCenter = false,
		class: className = '',
		showLabel = false,
		...restProps
	}: Props = $props();

	let buttonRef: HTMLButtonElement | null = null;
	let isTransitioning = false;
	let activeAnim: Animation | null = null;

	function getClipPaths(
		cx: number,
		cy: number,
		maxRadius: number,
		vw: number,
		vh: number
	): [string, string] {
		const toX = (x: number) => `${(x / vw) * 100}%`;
		const toY = (y: number) => `${(y / vh) * 100}%`;
		const point = (x: number, y: number) => `${toX(x)} ${toY(y)}`;
		const toRadius = (r: number) => `${(r / (Math.hypot(vw, vh) / Math.SQRT2)) * 100}%`;
		return [`circle(0% at ${point(cx, cy)})`, `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`];
	}

	function cleanup() {
		isTransitioning = false;
		const root = document.documentElement;
		delete root.dataset.magicuiThemeVt;
		root.style.removeProperty('--magicui-theme-toggle-vt-duration');
		root.style.removeProperty('--magicui-theme-vt-clip-from');
		if (activeAnim) {
			activeAnim.cancel();
			activeAnim = null;
		}
	}

	function handleToggle() {
		const btn = buttonRef;
		if (!btn || isTransitioning || document.documentElement.dataset.magicuiThemeVt === 'active') {
			return;
		}

		if (typeof document.startViewTransition !== 'function') {
			toggleMode();
			return;
		}

		const vw = window.innerWidth;
		const vh = window.innerHeight;
		let x: number;
		let y: number;

		if (fromCenter) {
			x = vw / 2;
			y = vh / 2;
		} else {
			const rect = btn.getBoundingClientRect();
			x = rect.left + rect.width / 2;
			y = rect.top + rect.height / 2;
		}

		const maxRadius = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y));
		const clipPath = getClipPaths(x, y, maxRadius, vw, vh);
		const root = document.documentElement;

		root.dataset.magicuiThemeVt = 'active';
		root.style.setProperty('--magicui-theme-toggle-vt-duration', `${duration}ms`);
		root.style.setProperty('--magicui-theme-vt-clip-from', clipPath[0]);

		isTransitioning = true;
		const transition = document.startViewTransition(() => {
			toggleMode();
		});

		transition.finished.finally(cleanup).catch(() => {});

		transition.ready
			.then(() => {
				activeAnim = document.documentElement.animate(
					{ clipPath },
					{
						duration,
						easing: 'ease-in-out',
						fill: 'forwards',
						pseudoElement: '::view-transition-new(root)'
					}
				);
			})
			.catch(() => {});
	}

	$effect(() => {
		return () => {
			untrack(() => cleanup());
		};
	});

	let isDark = $derived(mode.current === 'dark');
</script>

<button
	bind:this={buttonRef}
	type="button"
	onclick={handleToggle}
	class={className}
	aria-label={showLabel ? undefined : 'Toggle theme'}
	{...restProps}
>
	{#if isDark}
		<Sun class="size-4" />
	{:else}
		<Moon class="size-4" />
	{/if}
	{#if showLabel}
		<span class="ml-2 text-xs font-medium">{isDark ? 'Dark' : 'Light'}</span>
	{/if}
</button>
