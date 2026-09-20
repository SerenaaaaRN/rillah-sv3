<script lang="ts">
	import type { Snippet } from 'svelte';
	import { AppSidebar } from '$lib/components/layout/app-sidebar/index.js';
	import DynamicBreadcrumb from '$lib/components/layout/dynamic-breadcrumb.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { children }: { children: Snippet } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ms-1" />
			<Separator orientation="vertical" class="me-2 h-4" />
			<DynamicBreadcrumb />
		</header>
		<main class="mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">{@render children()}</main>
	</Sidebar.Inset>
</Sidebar.Provider>
