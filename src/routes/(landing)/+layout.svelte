<script lang="ts">
	import type { Snippet } from 'svelte';
	import DockMobile from '#lib/components/layout/dock-mobile.svelte';
	import Footer from '#lib/components/layout/footer.svelte';
	import {
		mainNavData,
		publicDashboardMenu
	} from '#lib/components/layout/landing-sidebar/constant.js';
	import ProfileHeader from '#lib/components/layout/landing-sidebar/profile-header.svelte';
	import SidebarMain from '#lib/components/layout/landing-sidebar/sidebar-main.svelte';
	import ScrollProgress from '#lib/components/layout/scroll-progress.svelte';
	import FlickeringGrid from '#lib/components/shared/flickering-grid.svelte';
	import ScrollToTop from '#lib/components/shared/scroll-to-top.svelte';
	import { IsMobile } from '#lib/hooks/is-mobile.svelte.js';

	let { children }: { children?: Snippet } = $props();

	const isMobile = new IsMobile();
</script>

<ScrollProgress />

<div
	class="pointer-events-none fixed inset-x-0 top-0 z-[-1] h-40 overflow-hidden mask-[linear-gradient(to_bottom,black,transparent)]"
>
	<FlickeringGrid
		class="size-full"
		squareSize={4}
		gridGap={6}
		color="#6B7280"
		maxOpacity={0.5}
		flickerChance={0.1}
		height={800}
		width={2000}
	/>
</div>

<div class="container mx-auto min-h-screen pt-12 sm:pt-24">
	{#if isMobile.current}
		<nav class="md:hidden" aria-label="Mobile navigation">
			<DockMobile items={mainNavData(false)} menu={publicDashboardMenu}>
				{#snippet header()}
					<ProfileHeader avatar="/rillah-avatar.avif" name="Rillah" handle="@duhairillah" compact />
				{/snippet}
			</DockMobile>
		</nav>
	{/if}

	<div class="flex min-w-0 md:gap-6">
		{#if !isMobile.current}
			<SidebarMain />
		{/if}

		<main class="mb-16 w-full min-w-0 overflow-x-clip pt-4">
			{@render children?.()}
		</main>
	</div>

	<Footer />
	<ScrollToTop />
</div>
