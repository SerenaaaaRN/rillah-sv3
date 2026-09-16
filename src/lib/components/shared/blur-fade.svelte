<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

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

	// svelte-ignore state_referenced_locally
	let visible = $state(!inView);
	let element: HTMLDivElement | undefined = $state(undefined);

	function inViewAction(node: HTMLElement) {
		if (!inView) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						visible = true;
						observer.disconnect();
						break;
					}
				}
			},
			{ rootMargin: '-50px', threshold: 0.1 }
		);
		observer.observe(node);
		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	$effect(() => {
		if (!inView && !visible) {
			const t = setTimeout(() => (visible = true), (0.04 + delay) * 1000);
			return () => clearTimeout(t);
		}
	});
</script>

<div
	bind:this={element}
	use:inViewAction
	class={className}
	style:opacity={visible ? '1' : '0'}
	style:transform={visible ? `translateY(${-yOffset}px)` : `translateY(${yOffset}px)`}
	style:filter={visible ? 'blur(0px)' : `blur(${blur})`}
	style:transition={`transform ${duration}s ease-out ${0.04 + delay}s, opacity ${duration}s ease-out ${0.04 + delay}s, filter ${duration}s ease-out ${0.04 + delay}s`}
	{...restProps}
>
	{@render children?.()}
</div>
