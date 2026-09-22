<script lang="ts">
	import CertificateIcon from 'phosphor-svelte/lib/Certificate';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Card, CardContent } from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Certification } from '$lib/schema/certificate.js';
	import { cn } from '$lib/utils';

	let { certification }: { certification: Certification } = $props();

	const title = $derived(certification.title);
	const provider = $derived(certification.provider);
	const issuedDisplay = $derived(certification.issuedDisplay);
	const image = $derived(certification.image);
</script>

<Dialog.Root>
	<Dialog.Trigger aria-label={`Preview ${title}`}>
		{#snippet child({ props })}
			<Card
				{...props}
				class={cn(
					'cursor-pointer border border-border transition-colors hover:border-foreground/20 hover:shadow-none',
					props.class as string
				)}
			>
				<CardContent>
					<div class="flex items-start gap-3">
						<div
							class="flex size-10 shrink-0 items-center justify-center border border-border bg-primary/5"
						>
							<CertificateIcon class="size-5 text-primary" />
						</div>

						<div class="min-w-0 flex-1">
							<h3 class="line-clamp-2 font-display text-sm font-semibold">
								{title}
							</h3>
							<p class="text-xs text-muted-foreground">{provider}</p>
							<div class="mt-1.5">
								<Badge
									variant="secondary"
									class="rounded-none border px-2 py-0 text-[11px] font-normal"
								>
									Issued &middot; {issuedDisplay}
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
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>
				{provider} &middot; {issuedDisplay}
			</Dialog.Description>
		</Dialog.Header>

		{#if image}
			<img
				src={image}
				alt={`${title} certificate`}
				decoding="async"
				class="max-h-[85vh] w-full rounded-none border border-border object-contain"
			/>
		{:else}
			<p class="py-8 text-center text-sm text-muted-foreground">
				No image preview available for this certification.
			</p>
		{/if}
	</Dialog.Content>
</Dialog.Root>
