<script lang="ts">
	import BlurFade from '$lib/components/shared/blur-fade.svelte';
	import MacWindow from '$lib/components/shared/mac-window.svelte';
	import * as SectionHeading from '$lib/components/shared/section-heading/index.js';
	import SeoHead from '$lib/components/shared/seo-head.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { UNSORTED_ORDER, type Certificate } from '$lib/schema/certificate.js';
	import { breadcrumbSchema, canonicalUrl } from '$lib/seo/site.js';
	import CertificateGridCard from './_components/certificate-grid-card.svelte';
	import CertificateLightbox from './_components/certificate-lightbox.svelte';
	import CertificatesToolbar, { type SortOption } from './_components/certificates-toolbar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const certificates = $derived(data.certificates);

	let search = $state('');
	let selectedIssuer = $state('All');
	let sortBy: SortOption = $state('highlight');
	let selectedId: string | null = $state(null);
	let lightboxOpen = $state(false);

	const issuers = $derived([
		'All',
		...new Set(certificates.map((c) => c.issuer.trim()).filter(Boolean))
	]);

	function getTime(date: string): number {
		if (!date) return 0;
		const time = new Date(date).getTime();
		return Number.isNaN(time) ? 0 : time;
	}

	const filteredCertificates = $derived.by(() => {
		let result =
			selectedIssuer === 'All'
				? certificates
				: certificates.filter((c) => c.issuer.trim() === selectedIssuer);
		const q = search.trim().toLowerCase();
		if (q) {
			result = result.filter(
				(c) => c.title.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q)
			);
		}
		return [...result].sort((a, b) => {
			if (sortBy === 'timeline') return getTime(b.date) - getTime(a.date);
			const orderA = a.display_order === UNSORTED_ORDER ? Infinity : a.display_order;
			const orderB = b.display_order === UNSORTED_ORDER ? Infinity : b.display_order;
			return orderA !== orderB ? orderA - orderB : getTime(b.date) - getTime(a.date);
		});
	});

	const hasActiveQuery = $derived(
		search.trim() !== '' || selectedIssuer !== 'All' || sortBy !== 'highlight'
	);

	function clearFilters() {
		search = '';
		selectedIssuer = 'All';
		sortBy = 'highlight';
	}

	const selectedIndex = $derived(
		selectedId ? filteredCertificates.findIndex((c) => c.id === selectedId) : -1
	);
	const selectedCert = $derived(
		selectedIndex === -1 ? null : (filteredCertificates[selectedIndex] ?? null)
	);
	const dialogOpen = $derived(lightboxOpen && selectedCert !== null);

	function openLightbox(cert: Certificate) {
		if (!cert.image_url.trim()) return;
		selectedId = cert.id;
		lightboxOpen = true;
	}

	function navigate(direction: 1 | -1) {
		if (filteredCertificates.length === 0) return;
		const current = selectedIndex === -1 ? 0 : selectedIndex;
		const next =
			filteredCertificates[
				(current + direction + filteredCertificates.length) % filteredCertificates.length
			];
		selectedId = next?.id ?? null;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!dialogOpen) return;
		if (e.key === 'ArrowLeft') navigate(-1);
		if (e.key === 'ArrowRight') navigate(1);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<SeoHead
	title="Certificates — Rillah"
	description="Professional training credentials, technical awards, and course milestones achieved by Rillah."
	canonical={canonicalUrl('/certificates')}
	jsonLd={[
		breadcrumbSchema([
			{ name: 'Home', url: canonicalUrl('/') },
			{ name: 'Certificates', url: canonicalUrl('/certificates') }
		])
	]}
/>

<BlurFade delay={0.25} inView>
	<SectionHeading.Root class="mb-8">
		<SectionHeading.Eyebrow>Credentials</SectionHeading.Eyebrow>
		<SectionHeading.Title as="h1">
			All <SectionHeading.Accent>certificates</SectionHeading.Accent>
		</SectionHeading.Title>
		<SectionHeading.Description>
			Technical achievements, professional training, and courses completed along my engineering
			journey.
		</SectionHeading.Description>
	</SectionHeading.Root>

	<MacWindow title="~/certificates">
		<CertificatesToolbar
			bind:search
			bind:selectedIssuer
			bind:sortBy
			{issuers}
			total={certificates.length}
			count={filteredCertificates.length}
		/>

		{#if filteredCertificates.length > 0}
			<ol class="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredCertificates as cert (cert.id)}
					<li>
						<CertificateGridCard {cert} onclick={() => openLightbox(cert)} />
					</li>
				{/each}
			</ol>
		{:else if certificates.length === 0}
			<p class="py-12 text-center text-sm text-muted-foreground">
				No certificates published yet. Check back soon.
			</p>
		{:else}
			<div class="flex flex-col items-center gap-2 py-12 text-center">
				<p class="text-sm text-muted-foreground">No certificates match your search.</p>
				{#if hasActiveQuery}
					<Button variant="ghost" size="sm" onclick={clearFilters}>Clear filters</Button>
				{/if}
			</div>
		{/if}
	</MacWindow>
</BlurFade>

<Dialog.Root open={dialogOpen} onOpenChange={(open) => (lightboxOpen = open)}>
	{#if selectedCert}
		<CertificateLightbox
			cert={selectedCert}
			index={selectedIndex}
			total={filteredCertificates.length}
			onPrev={() => navigate(-1)}
			onNext={() => navigate(1)}
		/>
	{/if}
</Dialog.Root>
