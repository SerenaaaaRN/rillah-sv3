<script lang="ts">
	import BaseLayout from '$lib/components/layout/base-layout.svelte';
	import SidebarMain from '$lib/components/layout/sidebar/sidebar-main.svelte';

	let { children } = $props();
</script>

<BaseLayout>
	{#snippet sidebar()}
		<SidebarMain />
	{/snippet}
	{@render children()}
</BaseLayout>
