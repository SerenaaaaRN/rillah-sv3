<script lang="ts">
	import CaretDown from 'phosphor-svelte/lib/CaretDown';
	import CaretUp from 'phosphor-svelte/lib/CaretUp';
	import type { Snippet } from 'svelte';
	import type { SidebarMenu } from '#lib/components/layout/landing-sidebar/constant.js';
	import MenuList from '#lib/components/layout/landing-sidebar/menu-list.svelte';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { cn } from '#lib/utils.js';

	let {
		menu,
		fullMenu,
		header,
		onNavigate
	}: {
		menu: SidebarMenu[];
		fullMenu: SidebarMenu[];
		header?: Snippet;
		onNavigate?: () => void;
	} = $props();

	let open = $state(false);

	const itemClass = cn(
		buttonVariants({ variant: 'ghost', size: 'icon' }),
		'size-12 transition-colors hover:bg-accent/50'
	);

	function handleItemClick() {
		open = false;
		onNavigate?.();
	}
</script>

<Sheet.Root bind:open>
	<div
		class="pointer-events-none fixed inset-x-0 bottom-8 z-30 mx-auto mb-4 flex h-full max-h-14 origin-bottom"
	>
		<div
			class="fixed inset-x-0 bottom-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"
		></div>

		<Tooltip.Provider delayDuration={0}>
			<div class="relative mx-auto">
				<!-- Dock Items (Menggunakan menu yang sudah difilter public) -->
				<div
					data-slot="dock-mobile"
					class="pointer-events-auto relative z-50 flex items-center gap-1 border bg-background px-1 py-1 shadow-[0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:border-white/10 dark:shadow-[0_-20px_80px_-20px_#ffffff1f_inset]"
				>
					{#each menu[0].menus as item (item.label)}
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									{#if item.action}
										<form method="POST" action={item.action} class="contents">
											<button
												type="submit"
												{...props}
												class={itemClass}
												aria-label={item.label}
												onclick={handleItemClick}
											>
												<item.icon class="size-4" />
											</button>
										</form>
									{:else}
										<a
											href={item.href}
											data-sveltekit-preload-code="eager"
											data-sveltekit-preload-data="hover"
											class={itemClass}
											aria-label={item.label}
											{...props}
										>
											<item.icon class="size-4" />
										</a>
									{/if}
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>{item.label}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					{/each}

					<Separator orientation="vertical" class="mx-1 h-6" />

					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<Sheet.Trigger {...props} class={itemClass} aria-label={open ? 'Collapse' : 'More'}>
									{#if open}
										<CaretDown class="size-4" />
									{:else}
										<CaretUp class="size-4" />
									{/if}
								</Sheet.Trigger>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>{open ? 'Collapse' : 'More'}</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</div>
		</Tooltip.Provider>
	</div>

	<Sheet.Content
		side="bottom"
		class="max-h-[80vh] overflow-y-auto border-t bg-background p-4 pb-20 shadow-2xl sm:mx-auto sm:max-w-lg"
	>
		<div class="mx-auto mb-4 h-1.5 w-12 bg-muted"></div>
		{@render header?.()}
		<MenuList menu={fullMenu} onItemClick={handleItemClick} />
	</Sheet.Content>
</Sheet.Root>
