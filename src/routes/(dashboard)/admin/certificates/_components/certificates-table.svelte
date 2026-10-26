<script lang="ts">
	import CertificateIcon from 'phosphor-svelte/lib/Certificate';
	import Pencil from 'phosphor-svelte/lib/Pencil';
	import DeleteConfirm from '#lib/components/shared/delete-confirm.svelte';
	import * as Table from '#lib/components/ui/table/index.js';
	import type { Certificate } from '#lib/schema/certificate.js';
	import { formatFullDate } from '#lib/utils/date.js';

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
								width="56"
								height="36"
								loading="lazy"
								decoding="async"
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
						<DeleteConfirm
							id={cert.id}
							invalidateTag="supabase:certificates"
							noun="certificate"
							title={cert.title}
						/>
					</div>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
