<script lang="ts">
	import type { Snippet } from 'svelte';
	import { nav } from '#lib/components/layout/app-sidebar/constant.js';
	import { AppSidebar } from '#lib/components/layout/app-sidebar/index.js';
	import DockMobile from '#lib/components/layout/dock-mobile.svelte';
	import DynamicBreadcrumb from '#lib/components/layout/dynamic-breadcrumb.svelte';
	import type { SidebarMenu } from '#lib/components/layout/landing-sidebar/constant.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import { IsMobile } from '#lib/hooks/is-mobile.svelte.js';

	let { children }: { children: Snippet } = $props();

	const isMobile = new IsMobile();

	const adminMenu: SidebarMenu[] = nav.map((group) => ({
		groupLabel: group.title,
		menus: group.items.map((item) => ({
			href: item.url,
			label: item.title,
			icon: item.icon,
			action: item.action
		}))
	}));
</script>

<Sidebar.Provider>
	{#if !isMobile.current}
		<div class="hidden md:contents">
			<AppSidebar />
		</div>
	{/if}
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ms-1 max-md:hidden" />
			<Separator orientation="vertical" class="me-2 h-4 max-md:hidden" />
			<DynamicBreadcrumb />
		</header>
		<main class="mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">{@render children()}</main>
	</Sidebar.Inset>
	{#if isMobile.current}
		<div>
			<DockMobile menu={adminMenu} fullMenu={adminMenu} />
		</div>
	{/if}
</Sidebar.Provider>
