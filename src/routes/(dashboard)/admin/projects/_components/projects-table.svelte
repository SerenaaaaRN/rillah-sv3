<script lang="ts">
	import { enhance } from '$app/forms';
	import ArrowSquareOut from 'phosphor-svelte/lib/ArrowSquareOut';
	import FolderOpen from 'phosphor-svelte/lib/FolderOpen';
	import Pencil from 'phosphor-svelte/lib/Pencil';
	import Trash from 'phosphor-svelte/lib/Trash';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import type { Project } from '$lib/schema/projects.js';

	let { projects }: { projects: Project[] } = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-10">#</Table.Head>
			<Table.Head>Title</Table.Head>
			<Table.Head>Slug</Table.Head>
			<Table.Head>Tags</Table.Head>
			<Table.Head class="text-right">Action</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each projects as project, idx (project.id ?? project.slug ?? String(idx))}
			{@const thumbnail = project.image?.[0] ?? ''}
			<Table.Row>
				<Table.Cell class="font-medium">{idx + 1}</Table.Cell>
				<Table.Cell>
					<div class="flex items-center gap-3">
						{#if thumbnail}
							<img
								src={thumbnail}
								alt={project.title}
								class="h-9 w-14 rounded-none border border-border object-cover"
							/>
						{:else}
							<div
								class="flex h-9 w-14 items-center justify-center rounded-none border border-border bg-muted"
							>
								<FolderOpen class="size-4 text-muted-foreground" />
							</div>
						{/if}
						<span class="font-medium">{project.title}</span>
					</div>
				</Table.Cell>
				<Table.Cell class="font-mono text-xs">{project.slug}</Table.Cell>
				<Table.Cell>
					<div class="flex flex-wrap gap-1">
						{#each project.tags.slice(0, 3) as tag (tag)}
							<Badge variant="outline" class="rounded-none text-[10px] text-muted-foreground"
								>{tag}</Badge
							>
						{/each}
						{#if project.tags.length > 3}
							<Badge variant="outline" class="rounded-none text-[10px] text-muted-foreground"
								>+{project.tags.length - 3}</Badge
							>
						{/if}
					</div>
				</Table.Cell>
				<Table.Cell>
					<div class="flex items-center justify-end gap-1">
						{#if project.demo}
							<a
								href={project.demo}
								target="_blank"
								rel="noopener noreferrer"
								class="rounded-none p-2 transition-colors hover:bg-muted"
								title="View Demo"><ArrowSquareOut class="size-4" /></a
							>
						{/if}
						<a
							href={`/admin/projects/${project.id}`}
							class="rounded-none p-2 transition-colors hover:bg-muted"
							title="Edit"><Pencil class="size-4" /></a
						>
						<AlertDialog.Root>
							<AlertDialog.Trigger>
								{#snippet child({ props })}
									<Button
										{...props}
										variant="ghost"
										size="icon"
										class="size-8 rounded-none text-destructive hover:text-destructive"
										title="Delete"
									>
										<Trash class="size-4" />
									</Button>
								{/snippet}
							</AlertDialog.Trigger>
							<AlertDialog.Content class="rounded-none">
								<AlertDialog.Header>
									<AlertDialog.Title>Delete project?</AlertDialog.Title>
									<AlertDialog.Description
										>This will permanently delete "{project.title}". This action cannot be undone.</AlertDialog.Description
									>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Cancel class="rounded-none">Cancel</AlertDialog.Cancel>
									<AlertDialog.Action
										class="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										{#snippet child({ props })}
											<form method="POST" action="?/delete" use:enhance {...props}>
												<input type="hidden" name="id" value={project.id} />
												<button type="submit" class="w-full">Delete</button>
											</form>
										{/snippet}
									</AlertDialog.Action>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
					</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
