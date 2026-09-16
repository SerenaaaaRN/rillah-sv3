<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card } from '$lib/components/ui/card/index.js';
	import CertificateIcon from 'phosphor-svelte/lib/Certificate';
	import Plus from 'phosphor-svelte/lib/Plus';
	import type { PageData } from './$types.js';
	import CertificatesTable from './_components/certificates-table.svelte';

	let { data }: { data: PageData } = $props();
	let certificates = $derived(
		(data.certificates ?? []) as import('$lib/schema/certificate.js').Certificate[]
	);

	let totalCertificates = $derived(certificates.length);
	let withImageCount = $derived(certificates.filter((c) => c.image_url).length);
	let withIssuerCount = $derived(certificates.filter((c) => c.issuer).length);
</script>

<div class="flex flex-col gap-8">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight">Certificates</h2>
			<p class="mt-1 text-sm text-muted-foreground">
				Manage your professional certifications — add, edit, or remove them.
			</p>
		</div>
		<Button size="sm" href="/admin/certificates/new"
			><Plus class="size-4" />Add New Certificate</Button
		>
	</header>

	{#if totalCertificates === 0}
		<section aria-label="Certificate statistics" class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<Card class="rounded-none p-4"
				><div class="flex items-center gap-3">
					<CertificateIcon class="size-5 text-muted-foreground" />
					<div>
						<p class="text-sm text-muted-foreground">Total Certificates</p>
						<p class="text-2xl font-bold">0</p>
					</div>
				</div></Card
			>
			<Card class="rounded-none p-4"
				><div class="flex items-center gap-3">
					<CertificateIcon class="size-5 text-muted-foreground" />
					<div>
						<p class="text-sm text-muted-foreground">With Image</p>
						<p class="text-2xl font-bold">0</p>
					</div>
				</div></Card
			>
			<Card class="rounded-none p-4"
				><div class="flex items-center gap-3">
					<CertificateIcon class="size-5 text-muted-foreground" />
					<div>
						<p class="text-sm text-muted-foreground">With Issuer</p>
						<p class="text-2xl font-bold">0</p>
					</div>
				</div></Card
			>
		</section>
		<div class="rounded-none border border-dashed border-border p-8 text-center">
			<p class="text-sm text-muted-foreground">No certificates yet</p>
			<Button size="sm" href="/admin/certificates/new" class="mt-3"
				>Create your first certificate →</Button
			>
		</div>
	{:else}
		<section aria-label="Certificate statistics" class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<Card class="rounded-none p-4"
				><div class="flex items-center gap-3">
					<CertificateIcon class="size-5 text-muted-foreground" />
					<div>
						<p class="text-sm text-muted-foreground">Total Certificates</p>
						<p class="text-2xl font-bold">{totalCertificates}</p>
					</div>
				</div></Card
			>
			<Card class="rounded-none p-4"
				><div class="flex items-center gap-3">
					<CertificateIcon class="size-5 text-muted-foreground" />
					<div>
						<p class="text-sm text-muted-foreground">With Image</p>
						<p class="text-2xl font-bold">{withImageCount}</p>
					</div>
				</div></Card
			>
			<Card class="rounded-none p-4"
				><div class="flex items-center gap-3">
					<CertificateIcon class="size-5 text-muted-foreground" />
					<div>
						<p class="text-sm text-muted-foreground">With Issuer</p>
						<p class="text-2xl font-bold">{withIssuerCount}</p>
					</div>
				</div></Card
			>
		</section>
		<CertificatesTable {certificates} />
	{/if}
</div>
