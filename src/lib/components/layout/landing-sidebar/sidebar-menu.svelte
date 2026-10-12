<script lang="ts">
	import { page } from '$app/state';
	import { mode } from 'mode-watcher';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import Moon from 'phosphor-svelte/lib/Moon';
	import Sun from 'phosphor-svelte/lib/Sun';
	import AnimatedThemeToggler from '$lib/components/shared/animated-theme-toggler.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { cn } from '$lib/utils.js';
	import { publicDashboardMenu, type SidebarMenu } from './constant.js';

	let {
		menu = publicDashboardMenu,
		onItemClick
	}: {
		menu?: SidebarMenu[];
		onItemClick?: () => void;
	} = $props();

	function isActive(href: string): boolean {
		const pathname = page.url.pathname;
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}
</script>

<nav data-slot="sidebar-menu">
	<ul class="flex flex-col items-start space-y-1">
		{#each menu as group, gi (group.groupLabel || gi)}
			<li class={cn('w-full', group.groupLabel && 'pt-5')}>
				{#if group.groupLabel}
					<Separator class="mb-2 opacity-50" />
					<p
						data-slot="sidebar-group-label"
						class="max-w-62 truncate px-4 pb-2 font-mono text-[11px] font-medium tracking-[0.15em] text-muted-foreground uppercase"
					>
						{group.groupLabel}
					</p>
				{/if}

				{#each group.menus as item (item.href)}
					{@const active = isActive(item.href)}

					{#if item.action}
						<form method="POST" action={item.action} class="contents">
							<Button
								type="submit"
								variant={active ? 'secondary' : 'ghost'}
								class="mb-1 h-10 w-full justify-between"
								onclick={onItemClick}
							>
								<span class="flex items-center gap-4 truncate">
									<item.icon size={18} class="shrink-0" />
									<span class="truncate text-sm">{item.label}</span>
								</span>
								<ArrowRight
									class={cn('size-3.5 transition-opacity', active ? 'opacity-60' : 'opacity-0')}
								/>
							</Button>
						</form>
					{:else}
						<Button
							variant={active ? 'secondary' : 'ghost'}
							class="mb-1 h-10 w-full justify-between"
							onclick={onItemClick}
							href={item.href}
							data-sveltekit-preload-code="viewport"
							data-sveltekit-preload-data="hover"
						>
							<span class="flex items-center gap-4 truncate">
								<item.icon size={18} class="shrink-0" />
								<span class="truncate text-sm">{item.label}</span>
							</span>
							<ArrowRight
								class={cn('size-3.5 transition-opacity', active ? 'opacity-60' : 'opacity-0')}
							/>
						</Button>
					{/if}
				{/each}
			</li>
		{/each}
	</ul>

	<div class="mt-4 flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2.5">
		<div class="flex items-center gap-2">
			<div class="flex h-7 w-7 items-center justify-center rounded-md border bg-background">
				{#if mode.current === 'dark'}
					<Moon class="h-3.5 w-3.5" />
				{:else}
					<Sun class="h-3.5 w-3.5" />
				{/if}
			</div>
			<div class="flex flex-col leading-none">
				<span class="text-xs font-medium">Dark mode</span>
				<span class="text-[11px] text-muted-foreground">
					{mode.current === 'dark' ? 'On' : 'Off'}
				</span>
			</div>
		</div>
		<AnimatedThemeToggler
			class="flex h-8 w-8 items-center justify-center rounded-md border bg-background transition-colors hover:bg-accent"
			duration={400}
		/>
	</div>
</nav>
