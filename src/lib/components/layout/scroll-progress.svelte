<script lang="ts">
	import { Progress } from '#lib/components/ui/progress/index.js';

	let progress = $state(0);

	const update = () => {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
	};

	$effect(() => {
		update();
		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update);
		return () => {
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		};
	});
</script>

<Progress
	value={progress * 100}
	max={100}
	class="fixed inset-x-0 top-0 z-1000 h-1 rounded-none bg-transparent"
	aria-hidden="true"
/>

<style>
	:global([data-slot='progress'][class*='fixed'] [data-slot='progress-indicator']) {
		background-image: linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary)));
	}
	:global(.dark [data-slot='progress'][class*='fixed'] [data-slot='progress-indicator']) {
		background-image: linear-gradient(to right, #91f87c, #8ff38c, #92fda4);
	}
</style>
