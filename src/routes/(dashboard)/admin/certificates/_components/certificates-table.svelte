<script lang="ts">
	import { enhance } from '$app/forms';
	import CertificateIcon from 'phosphor-svelte/lib/Certificate';
	import Pencil from 'phosphor-svelte/lib/Pencil';
	import Trash from 'phosphor-svelte/lib/Trash';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { Certificate } from '$lib/schema/certificate.js';
	import { formatFullDate } from '$lib/utils/date.js';

	let { certificates }: { certificates: Certificate[] } = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-10">#</Table.Head>
			<Table.Head>Title</Table.Head>
			<Table.Head>Issuer</Table.Head>
			<Table.Head>Date</Table.Head>
			<Table.Head class="text-right">Action</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each certificates as cert, idx (cert.id)}
			<Table.Row>
				<Table.Cell class="font-medium">{idx + 1}</Table.Cell>
				<Table.Cell>
					<div class="flex items-center gap-3">
						{#if cert.image_url}
							<img
								src={cert.image_url}
								alt={cert.title}
								class="h-9 w-14 rounded-none border border-border object-cover"
							/>
						{:else}
							<div
								class="flex h-9 w-14 items-center justify-center rounded-none border border-border bg-muted"
							>
								<CertificateIcon class="size-4 text-muted-foreground" />
							</div>
						{/if}
						<span class="font-medium">{cert.title}</span>
					</div>
				</Table.Cell>
				<Table.Cell>{cert.issuer}</Table.Cell>
				<Table.Cell class="text-xs text-muted-foreground">{formatFullDate(cert.date)}</Table.Cell>
				<Table.Cell>
					<div class="flex items-center justify-end gap-1">
						<a
							href={`/admin/certificates/${cert.id}`}
							class="rounded-none p-2 hover:bg-muted"
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
									<AlertDialog.Title>Delete certificate?</AlertDialog.Title>
									<AlertDialog.Description
										>This will permanently delete "{cert.title}". This action cannot be undone.</AlertDialog.Description
									>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Cancel class="rounded-none">Cancel</AlertDialog.Cancel>
									<AlertDialog.Action
										class="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										{#snippet child({ props })}
											<form method="POST" action="?/delete" use:enhance {...props}>
												<input type="hidden" name="id" value={cert.id} />
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
