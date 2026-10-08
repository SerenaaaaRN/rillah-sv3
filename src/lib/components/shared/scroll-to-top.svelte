<script lang="ts">
	import ArrowUp from 'phosphor-svelte/lib/ArrowUp';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	let visible = $state(false);

	const toggle = () => {
		const top = window.scrollY || document.documentElement.scrollTop;
		visible = top > 300;
	};

	$effect(() => {
		toggle();
		window.addEventListener('scroll', toggle, { passive: true });
		return () => window.removeEventListener('scroll', toggle);
	});

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

<Button
	variant="default"
	size="icon"
	onclick={scrollToTop}
	class={cn(
		'fixed right-6 bottom-20 z-9999 size-12 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110',
		visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
	)}
	aria-label="Scroll to top"
>
	<ArrowUp class="size-5" />
</Button>
