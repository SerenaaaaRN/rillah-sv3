<script lang="ts">
	import { page } from '$app/state';
	import { mode } from 'mode-watcher';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import Certificate from 'phosphor-svelte/lib/Certificate';
	import Coffee from 'phosphor-svelte/lib/Coffee';
	import House from 'phosphor-svelte/lib/House';
	import Moon from 'phosphor-svelte/lib/Moon';
	import Rss from 'phosphor-svelte/lib/Rss';
	import SignIn from 'phosphor-svelte/lib/SignIn';
	import Sun from 'phosphor-svelte/lib/Sun';
	import User from 'phosphor-svelte/lib/User';
	import type { Component } from 'svelte';
	import AnimatedThemeToggler from '$lib/components/shared/animated-theme-toggler.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { cn } from '$lib/utils.js';
	import { publicDashboardMenu, type SidebarMenu } from './constant.js';

	const ICONS: Record<string, Component> = {
		House,
		Coffee,
		Rss,
		Award: Certificate,
		User,
		LogIn: SignIn
	};

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
		return pathname === href || pathname.startsWith(`${href}/`);
	}

	function getIcon(name: string): Component {
		return ICONS[name] ?? House;
	}
</script>

<nav data-slot="sidebar-menu">
	<ul class="flex flex-col items-start space-y-1">
		{#each menu as group, gi (group.groupLabel + gi)}
			<li class={cn('w-full', group.groupLabel ? 'pt-5' : '')}>
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
					{@const Icon = getIcon(item.icon)}
					<Button
						variant={active ? 'secondary' : 'ghost'}
						class="mb-1 h-10 w-full justify-between"
						onclick={() => onItemClick?.()}
						href={item.href}
						data-sveltekit-preload-code="viewport"
						data-sveltekit-preload-data="hover"
					>
						<span class="flex items-center">
							<span class="mr-4">
								<Icon size={18} />
							</span>
							<span class="flex max-w-50 grow truncate text-sm">
								{item.label}
							</span>
						</span>
						<ArrowRight class={cn('size-3.5 opacity-60', active ? 'block' : 'hidden')} />
					</Button>
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
				<span class="text-[11px] text-muted-foreground"
					>{mode.current === 'dark' ? 'On' : 'Off'}</span
				>
			</div>
		</div>
		<AnimatedThemeToggler
			class="flex h-8 w-8 items-center justify-center rounded-md border bg-background transition-colors hover:bg-accent"
			duration={400}
		/>
	</div>
</nav>
