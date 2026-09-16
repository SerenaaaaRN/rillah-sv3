<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import CaretUpDown from 'phosphor-svelte/lib/CaretUpDown';
	import Check from 'phosphor-svelte/lib/CheckIcon';
	import AppWindow from 'phosphor-svelte/lib/AppWindow';
	let { versions, defaultVersion }: { versions: string[]; defaultVersion: string } = $props();
	// svelte-ignore state_referenced_locally
	let selectedVersion = $state(defaultVersion);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<div
							class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
						>
							<AppWindow class="size-4" />
						</div>
						<div class="flex flex-col gap-0.5 leading-none">
							<span class="font-semibold">Rillah</span>
							<span class="">v{selectedVersion}</span>
						</div>
						<CaretUpDown class="ms-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)" align="start">
				{#each versions as version (version)}
					<DropdownMenu.Item onSelect={() => (selectedVersion = version)}>
						v{version}
						{#if version === selectedVersion}
							<Check class="ms-auto" />
						{/if}
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
