<script lang="ts">
	import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
	import CaretRight from 'phosphor-svelte/lib/CaretRight';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Certificate } from '$lib/schema/certificate.js';

	let {
		cert,
		index,
		total,
		onPrev,
		onNext
	}: {
		cert: Certificate;
		index: number;
		total: number;
		onPrev: () => void;
		onNext: () => void;
	} = $props();
</script>

<Dialog.Content class="sm:max-w-5xl">
	<Dialog.Header>
		<Dialog.Title>{cert.title}</Dialog.Title>
		<Dialog.Description>
			{cert.issuer} &middot; {cert.date}
		</Dialog.Description>
	</Dialog.Header>

	<div class="relative flex items-center justify-center">
		{#if cert.image_url.trim()}
			<img
				src={cert.image_url}
				alt={cert.title}
				class="max-h-[75dvh] w-full rounded-none border border-border object-contain"
			/>
		{:else}
			<p class="py-8 text-center text-sm text-muted-foreground">
				No image preview available for this certification.
			</p>
		{/if}

		{#if total > 1}
			<Button
				type="button"
				variant="outline"
				size="icon"
				onclick={onPrev}
				class="absolute top-1/2 left-2 size-11 -translate-y-1/2 rounded-full"
				aria-label="Previous certificate"
			>
				<CaretLeft class="size-5" aria-hidden="true" />
			</Button>
			<Button
				type="button"
				variant="outline"
				size="icon"
				onclick={onNext}
				class="absolute top-1/2 right-2 size-11 -translate-y-1/2 rounded-full"
				aria-label="Next certificate"
			>
				<CaretRight class="size-5" aria-hidden="true" />
			</Button>
		{/if}
	</div>

	<p
		aria-live="polite"
		aria-atomic="true"
		class="text-center font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase"
	>
		Certificate {String(index + 1).padStart(2, '0')} of {String(total).padStart(2, '0')}
	</p>
</Dialog.Content>
