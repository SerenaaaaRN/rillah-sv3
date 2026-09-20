<script lang="ts">
	import { page } from '$app/state';
	import AppWindow from 'phosphor-svelte/lib/AppWindow';
	import type { ComponentProps } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { nav } from './constant.js';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

{#snippet navItems(items: (typeof nav)[number]['items'])}
	{#each items as item (item.title)}
		<Sidebar.MenuItem>
			<Sidebar.MenuButton isActive={page.url.pathname === item.url}>
				{#snippet child({ props })}
					{#if item.action}
						<form method="POST" action={item.action} class="contents">
							<button type="submit" {...props}>
								<item.icon />
								<span>{item.title}</span>
							</button>
						</form>
					{:else}
						<a href={item.url} {...props}>
							<item.icon />
							<span>{item.title}</span>
						</a>
					{/if}
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	{/each}
{/snippet}

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					<div
						class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
					>
						<AppWindow class="size-4" />
					</div>
					<div class="flex flex-col gap-0.5 leading-none">
						<span class="font-semibold">Rillah</span>
					</div>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- We create a Sidebar.Group for each parent. -->
		{#each nav.slice(0, -1) as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{@render navItems(group.items)}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Footer>
		{#each nav.slice(-1) as group (group.title)}
			<Sidebar.Menu>
				{@render navItems(group.items)}
			</Sidebar.Menu>
		{/each}
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
