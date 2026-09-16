<script lang="ts">
	import ScrollProgress from '$lib/components/layout/scroll-progress.svelte';
	import ScrollToTop from '$lib/components/layout/scroll-to-top.svelte';
	import DockMobile from '$lib/components/layout/dock-mobile.svelte';
	import Footer from '$lib/components/layout/footer.svelte';
	import FlickeringGrid from '$lib/components/shared/flickering-grid.svelte';
	import type { Snippet } from 'svelte';

	let {
		children,
		sidebar,
		useGridBackground = true
	}: {
		children?: Snippet;
		sidebar?: Snippet;
		useGridBackground?: boolean;
	} = $props();
</script>

<ScrollProgress />

<div class="container mx-auto min-h-screen pt-12 sm:pt-24">
	{#if useGridBackground}
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
	{/if}

	<div class="block md:hidden">
		<DockMobile />
	</div>

	<div class="flex min-w-0 md:gap-6">
		{#if sidebar}
			<aside>
				{@render sidebar()}
			</aside>
		{/if}
		<main class="mb-16 w-full min-w-0 overflow-x-clip pt-4">
			{@render children?.()}
		</main>
	</div>

	<Footer />
	<ScrollToTop />
</div>
