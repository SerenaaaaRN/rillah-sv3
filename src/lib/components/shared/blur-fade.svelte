<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { on } from 'svelte/events';
	import { createSubscriber } from 'svelte/reactivity';

	let {
		class: className,
		children,
		delay = 0,
		duration = 0.4,
		yOffset = 6,
		inView = false,
		blur = '6px',
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		delay?: number;
		duration?: number;
		yOffset?: number;
		inView?: boolean;
		blur?: string;
	} = $props();

	const subscribeReducedMotion =
		typeof window !== 'undefined'
			? createSubscriber((update) => {
					const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
					const off = on(mql, 'change', update);
					return () => off();
				})
			: () => {};

	const prefersReducedMotion = $derived.by(() => {
		subscribeReducedMotion();
		return typeof window !== 'undefined'
			? window.matchMedia('(prefers-reduced-motion: reduce)').matches
			: false;
	});

	let isIntersected = $state(false);
	const visible = $derived(prefersReducedMotion || !inView || isIntersected);

	function observeInView(node: HTMLElement) {
		if (!inView || prefersReducedMotion) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						isIntersected = true;
						observer.disconnect();
						break;
					}
				}
			},
			{ rootMargin: '0px', threshold: 0.1 }
		);

		observer.observe(node);

		return () => {
			observer.disconnect();
		};
	}
</script>

<div
	{@attach observeInView}
	class={className}
	style:--duration="{duration}s"
	style:--delay="{delay}s"
	style:--y-offset="{yOffset}px"
	style:--blur={blur}
	style:opacity={visible ? '1' : '0'}
	style:transform={visible ? 'translateY(0)' : 'translateY(var(--y-offset))'}
	style:filter={visible ? 'blur(0px)' : 'blur(var(--blur))'}
	style:transition={prefersReducedMotion
		? 'none'
		: 'transform var(--duration) ease-out var(--delay), opacity var(--duration) ease-out var(--delay), filter var(--duration) ease-out var(--delay)'}
	style:will-change={visible ? 'auto' : 'transform, opacity, filter'}
	{...restProps}
>
	{@render children?.()}
</div>
