<script lang="ts">
	import CaretDown from 'phosphor-svelte/lib/CaretDown';
	import CaretUp from 'phosphor-svelte/lib/CaretUp';
	import SealCheck from 'phosphor-svelte/lib/SealCheck';
	import { mainNavData } from '$lib/components/layout/sidebar/constant.js';
	import SidebarMenu from '$lib/components/layout/sidebar/sidebar-menu.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { cn } from '$lib/utils.js';

	let open = $state(false);

	const mainNav = mainNavData(false);
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
				<!-- Dock via shadcn Button + Tooltip + Separator -->
				<div
					data-slot="dock-mobile"
					class="pointer-events-auto relative z-50 flex items-center gap-1 rounded-full border bg-background px-1 py-1 shadow-[0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:border-white/10 dark:shadow-[0_-20px_80px_-20px_#ffffff1f_inset]"
				>
					{#each mainNav as item (item.label)}
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<a
										href={item.href}
										data-sveltekit-preload-code="eager"
										data-sveltekit-preload-data="hover"
										class={cn(
											buttonVariants({ variant: 'ghost', size: 'icon' }),
											'size-12 rounded-full transition-colors hover:bg-accent/50'
										)}
										aria-label={item.label}
										{...props}
									>
										<item.icon class="size-4" />
									</a>
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
								<Sheet.Trigger
									{...props}
									class={cn(
										buttonVariants({ variant: 'ghost', size: 'icon' }),
										'size-12 rounded-full transition-colors hover:bg-accent/50'
									)}
									aria-label={open ? 'Collapse' : 'More'}
								>
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
		class="max-h-[80vh] overflow-y-auto rounded-t-3xl border-t bg-background p-4 pb-20 shadow-2xl sm:mx-auto sm:max-w-lg"
	>
		<div class="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted"></div>
		<div class="mb-4 flex items-center gap-4">
			<Avatar.Root class="size-16! shrink-0 ring-1 ring-border">
				<Avatar.Image src="/rillah.jpeg" alt="Rillah" class="object-cover" />
				<Avatar.Fallback class="rounded-full bg-muted font-display font-bold">RH</Avatar.Fallback>
			</Avatar.Root>
			<div class="flex-1 space-y-1">
				<h4 class="flex items-center gap-2 font-display text-base font-bold">
					Rillah
					<SealCheck size={14} class="text-primary" />
				</h4>
				<div class="flex items-center gap-2">
					<div class="relative">
						<div class="h-3 w-3 rounded-full bg-green-500"></div>
						<div
							class="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-500 opacity-75"
						></div>
					</div>
					<p class="text-xs font-medium text-green-600 dark:text-green-400">Online</p>
					<p class="text-xs text-primary/55">@duhairillah</p>
				</div>
			</div>
		</div>
		<SidebarMenu onItemClick={() => (open = false)} />
	</Sheet.Content>
</Sheet.Root>
