<script lang="ts">
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import BlurFade from '#lib/components/shared/blur-fade.svelte';
	import * as SectionHeading from '#lib/components/shared/section-heading/index.js';
	import * as Dialog from '#lib/components/ui/dialog/index.js';
	import type { Certificate, Certification } from '#lib/schema/certificate.js';
	import CertificateLightbox from '../../certificates/_components/certificate-lightbox.svelte';
	import CertificationCard from './certificates-card.svelte';

	let { certifications = [] }: { certifications?: Certification[] } = $props();

	let selectedIndex = $state<number | null>(null);
	let isDialogOpen = $state(false);

	let previewCertificates = $derived(certifications.slice(0, 3));

	let mappedCertificates = $derived<Certificate[]>(
		previewCertificates.map((c, idx) => ({
			id: c.id,
			title: c.title,
			issuer: c.provider,
			date: c.issuedDisplay,
			image_url: c.image ?? '',
			category: '',
			credential_url: '',
			display_order: idx,
			created_at: new Date().toISOString()
		}))
	);

	let selectedCert = $derived(selectedIndex !== null ? mappedCertificates[selectedIndex] : null);

	function openModal(index: number) {
		selectedIndex = index;
		isDialogOpen = true;
	}

	function navigate(direction: number) {
		if (selectedIndex === null) return;
		const total = mappedCertificates.length;
		selectedIndex = (selectedIndex + direction + total) % total;
	}
</script>

{#if certifications.length > 0}
	<BlurFade delay={0.25} inView>
		<section id="certifications" class="mt-10">
			<div class="mb-6 flex items-end justify-between gap-4">
				<SectionHeading.Root>
					<SectionHeading.Eyebrow>Credentials</SectionHeading.Eyebrow>
					<SectionHeading.Title>
						Latest <SectionHeading.Accent>certifications</SectionHeading.Accent>
					</SectionHeading.Title>
				</SectionHeading.Root>
				<a
					href="/certificates"
					data-sveltekit-preload-code="viewport"
					data-sveltekit-preload-data="hover"
					class="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase transition-colors hover:text-primary"
				>
					<span>View all</span>
					<ArrowRight class="size-4" />
				</a>
			</div>

			<div class="grid grid-cols-1 gap-3">
				{#each previewCertificates as cert, i (cert.id)}
					<CertificationCard certification={cert} onclick={() => openModal(i)} />
				{/each}
			</div>

			<Dialog.Root
				open={isDialogOpen}
				onOpenChange={(open) => {
					isDialogOpen = open;
					if (!open) selectedIndex = null;
				}}
			>
				{#if selectedCert && selectedIndex !== null}
					<CertificateLightbox
						cert={selectedCert}
						index={selectedIndex}
						total={mappedCertificates.length}
						onPrev={() => navigate(-1)}
						onNext={() => navigate(1)}
					/>
				{/if}
			</Dialog.Root>
		</section>
	</BlurFade>
{/if}
