<script lang="ts">
	import SealCheck from 'phosphor-svelte/lib/SealCheck';
	import SidebarMenu from './sidebar-menu.svelte';

	const name = 'Rillah';
	const avatar = '/rillah-avatar.avif';
</script>

<aside
	data-slot="sidebar-main"
	class="sticky top-16 hidden max-h-[calc(100vh-4rem)] flex-col overflow-y-auto px-3 pt-4 pb-6 md:flex md:w-52 lg:w-64"
	aria-label="User profile and navigation"
>
	<header class="mb-3 px-1">
		<div class="relative mb-3">
			<img
				src={avatar}
				alt={name}
				width={100}
				height={100}
				loading="eager"
				fetchpriority="high"
				decoding="async"
				class="size-25! rounded-full object-cover ring-1 ring-border"
			/>
		</div>

		<div class="space-y-1">
			<h2 class="flex items-center font-display text-xl font-bold tracking-tight">
				{name}
				<SealCheck size={18} class="ml-2 text-primary" aria-label="Verified" />
			</h2>

			<div class="mt-2 flex items-center gap-2">
				<div class="flex items-center gap-2">
					<span class="relative flex h-2 w-2" role="status" aria-label="Online">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"
						></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
					</span>
					<p class="text-xs font-medium text-green-700 dark:text-green-500">Online</p>
				</div>
				<p class="text-xs text-primary/55">@duhairillah</p>
			</div>
		</div>
	</header>

	<SidebarMenu />
</aside>
