<script lang="ts">
	import ProfileHeader from './profile-header.svelte';
	import SidebarMenu from './sidebar-menu.svelte';

	const name = 'Rillah';
	const avatar = '/rillah-avatar.avif';
</script>

<aside
	data-slot="sidebar-main"
	class="sticky top-16 hidden max-h-[calc(100vh-4rem)] flex-col overflow-y-auto px-3 pt-4 pb-6 md:flex md:w-52 lg:w-64"
	aria-label="User profile and navigation"
>
	<ProfileHeader {avatar} {name} handle="@duhairillah" />

	<SidebarMenu />
</aside>
