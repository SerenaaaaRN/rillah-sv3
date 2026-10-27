<script lang="ts">
	import type { SidebarMenu } from './constant.js';
	import MenuList from './menu-list.svelte';
	import ProfileHeader from './profile-header.svelte';

	const name = 'Rillah';
	const avatar = '/rillah-avatar.avif';

	let { menu }: { menu: SidebarMenu[] } = $props();
</script>

<aside
	data-slot="sidebar-main"
	class="sticky top-16 hidden max-h-[calc(100vh-4rem)] flex-col overflow-y-auto px-3 pt-4 pb-6 md:flex md:w-52 lg:w-64"
>
	<ProfileHeader {avatar} {name} handle="@duhairillah" />
	<MenuList {menu} />
</aside>
