<script lang="ts">
	import CertificateIcon from 'phosphor-svelte/lib/Certificate';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Card, CardContent } from '$lib/components/ui/card/index.js';
	import type { Certification } from '$lib/schema/certificate.js';
	import { cn } from '$lib/utils.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		certification: Certification;
		onclick?: () => void;
	}

	let { certification, onclick, class: className, ...restProps }: Props = $props();

	let title = $derived(certification.title);
	let provider = $derived(certification.provider);
	let issuedDisplay = $derived(certification.issuedDisplay);
</script>

<Card
	role="button"
	tabindex={0}
	{onclick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick?.();
		}
	}}
	{...restProps}
	class={cn(
		'cursor-pointer border border-border transition-colors hover:border-foreground/20 hover:shadow-none',
		className
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
					<Badge variant="secondary" class="rounded-none border px-2 py-0 text-[11px] font-normal">
						Issued &middot; {issuedDisplay}
					</Badge>
				</div>
			</div>
		</div>
	</CardContent>
</Card>
