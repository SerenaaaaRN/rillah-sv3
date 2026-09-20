<script lang="ts">
	import SealCheck from 'phosphor-svelte/lib/SealCheck';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import SidebarMenu from './sidebar-menu.svelte';

	const name = 'Rillah';
	const avatar = '/rillah.jpeg';
</script>

<div
	data-slot="sidebar-main"
	class="sticky top-16 hidden max-h-[calc(100vh-4rem)] flex-col overflow-y-auto px-3 pt-4 pb-6 md:flex md:w-52 lg:w-64"
>
	<div class="mb-3 px-1">
		<div class="relative mb-3">
			<Avatar.Root class="size-25! ring-1 ring-border">
				<Avatar.Image src={avatar} alt={name} class="object-cover" />
				<Avatar.Fallback class="rounded-full bg-muted font-display text-lg font-bold"
					>{name.slice(0, 2).toUpperCase()}</Avatar.Fallback
				>
			</Avatar.Root>
		</div>

		<div class="space-y-1">
			<h4 class="flex items-center font-display text-xl font-bold tracking-tight">
				{name}
				<SealCheck size={18} class="ml-2 text-primary" />
			</h4>

			<div class="mt-2 flex items-center gap-2">
				<div class="flex items-center gap-2">
					<div class="relative">
						<div class="h-2 w-2 rounded-full bg-green-500"></div>
					</div>
					<p class="text-xs font-medium text-green-700 dark:text-green-500">Online</p>
				</div>
				<p class="text-xs text-primary/55">@duhairillah</p>
			</div>
		</div>
	</div>
	<SidebarMenu />
</div>
