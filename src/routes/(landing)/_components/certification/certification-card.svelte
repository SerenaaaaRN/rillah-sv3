<script lang="ts">
	import CertificateIcon from 'phosphor-svelte/lib/Certificate';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Card, CardContent } from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Certification } from '$lib/schema/certificate.js';

	let {
		certification,
		compact = false
	}: {
		certification: Certification;
		compact?: boolean;
	} = $props();

	const ui = $derived({
		pad: compact ? 'p-4' : 'p-6',
		gap: compact ? 'gap-3' : 'gap-4',
		box: compact ? 'size-10' : 'size-16',
		icon: compact ? 'size-5' : 'size-8',
		title: compact ? 'text-sm' : 'text-lg',
		provider: compact ? 'text-xs' : 'text-sm',
		badge: compact ? 'px-2 py-0 text-[10px]' : 'px-2 py-0 text-xs',
		metaGap: compact ? 'mt-1.5' : 'mt-3'
	});
</script>

<Dialog.Root>
	<Dialog.Trigger aria-label={`Preview ${certification.title}`}>
		{#snippet child({ props })}
			<Card
				{...props}
				class="cursor-pointer border border-border transition-colors hover:border-foreground/20 hover:shadow-none"
			>
				<CardContent class={ui.pad}>
					<div class={`flex items-start ${ui.gap}`}>
						<div
							class={`flex shrink-0 items-center justify-center border border-border bg-primary/5 ${ui.box}`}
						>
							<CertificateIcon class={`${ui.icon} text-primary`} />
						</div>

						<div class="min-w-0 flex-1">
							<h3 class={`line-clamp-2 font-display font-semibold ${ui.title}`}>
								{certification.title}
							</h3>
							<p class={`${ui.provider} text-muted-foreground`}>{certification.provider}</p>
							<div class={ui.metaGap}>
								<Badge variant="secondary" class={`rounded-none border font-normal ${ui.badge}`}>
									Issued &middot; {certification.issuedDisplay}
								</Badge>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-5xl">
		<Dialog.Header>
			<Dialog.Title>{certification.title}</Dialog.Title>
			<Dialog.Description>
				{certification.provider} &middot; {certification.issuedDisplay}
			</Dialog.Description>
		</Dialog.Header>
		{#if certification.image}
			<img
				src={certification.image}
				alt={`${certification.title} certificate`}
				class="max-h-[85vh] w-full rounded-none border border-border object-contain"
			/>
		{:else}
			<p class="py-8 text-center text-sm text-muted-foreground">
				No image preview available for this certification.
			</p>
		{/if}
	</Dialog.Content>
</Dialog.Root>
