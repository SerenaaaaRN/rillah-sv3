<script lang="ts">
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import BlurFade from '$lib/components/shared/blur-fade.svelte';
	import * as SectionHeading from '$lib/components/shared/section-heading';
	import type { Certification } from '$lib/schema/certificate.js';
	import CertificationCard from './certification-card.svelte';

	let { certifications = [] }: { certifications?: Certification[] } = $props();
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
				{#each certifications.slice(0, 3) as cert (cert.id)}
					<CertificationCard certification={cert} />
				{/each}
			</div>
		</section>
	</BlurFade>
{/if}
