<script lang="ts">
	import CertificateIcon from 'phosphor-svelte/lib/Certificate';
	import Plus from 'phosphor-svelte/lib/Plus';
	import StatCard from '#lib/components/shared/stat-card.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import CertificatesTable from './_components/certificates-table.svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
	let certificates = $derived(
		(data.certificates ?? []) as import('#lib/schema/certificate.js').Certificate[]
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

	<section aria-label="Certificate statistics" class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<StatCard title="Total Certificates" value={totalCertificates} icon={CertificateIcon} />
		<StatCard title="With Image" value={withImageCount} icon={CertificateIcon} />
		<StatCard title="With Issuer" value={withIssuerCount} icon={CertificateIcon} />
	</section>

	{#if totalCertificates === 0}
		<div class="rounded-none border border-dashed border-border p-8 text-center">
			<p class="text-sm text-muted-foreground">No certificates yet</p>
			<Button size="sm" href="/admin/certificates/new" class="mt-3"
				>Create your first certificate →</Button
			>
		</div>
	{:else}
		<CertificatesTable {certificates} />
	{/if}
</div>
