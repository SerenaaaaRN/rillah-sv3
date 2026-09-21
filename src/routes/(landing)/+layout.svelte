<script lang="ts">
	import type { Snippet } from 'svelte';
	import DockMobile from '$lib/components/layout/dock-mobile.svelte';
	import Footer from '$lib/components/layout/footer.svelte';
	import ScrollProgress from '$lib/components/layout/scroll-progress.svelte';
	import SidebarMain from '$lib/components/layout/sidebar/sidebar-main.svelte';
	import FlickeringGrid from '$lib/components/shared/flickering-grid.svelte';
	import ScrollToTop from '$lib/components/shared/scroll-to-top.svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<ScrollProgress />

<div class="container mx-auto min-h-screen pt-12 sm:pt-24">
	<div
		class="pointer-events-none fixed inset-0 z-[-1] flex h-40 items-center justify-center overflow-hidden"
	>
		<div
			class="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background mask-[linear-gradient(to_bottom,black,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)]"
		>
			<FlickeringGrid
				class="absolute inset-0 z-0 size-full w-full"
				squareSize={4}
				gridGap={6}
				color="#6B7280"
				maxOpacity={0.5}
				flickerChance={0.1}
				height={800}
				width={2000}
			/>
		</div>
	</div>

	<nav class="block md:hidden" aria-label="Mobile navigation">
		<DockMobile />
	</nav>

	<div class="flex min-w-0 md:gap-6">
		<SidebarMain />

		<main class="mb-16 w-full min-w-0 overflow-x-clip pt-4">
			{@render children?.()}
		</main>
	</div>

	<Footer />
	<ScrollToTop />
</div>
