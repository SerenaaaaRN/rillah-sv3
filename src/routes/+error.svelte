<script lang="ts">
	import { page } from '$app/stores';
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import House from 'phosphor-svelte/lib/House';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	const status = $derived($page.status);
	const message = $derived($page.error?.message ?? 'Something went wrong');

	const errorMeta = $derived.by(() => {
		switch (status) {
			case 404:
				return {
					label: 'Lost?',
					title: "This page doesn't exist.",
					description: 'It might have been removed, renamed, or never existed at all.'
				};
			case 403:
				return {
					label: 'Restricted',
					title: 'Access denied.',
					description: 'You need proper authorization to view this resource.'
				};
			case 500:
				return {
					label: 'Oops',
					title: 'Something broke.',
					description: "We've been notified and are working on a fix."
				};
			default:
				return {
					label: 'Error',
					title: `Error ${status}`,
					description: message
				};
		}
	});
</script>

<div class="flex min-h-[80vh] flex-col items-center justify-center px-6 py-12">
	<span
		class="font-display text-5xl leading-none font-black tracking-tighter text-primary/15 select-none sm:text-6xl"
		aria-hidden="true"
	>
		{status}
	</span>

	<div class="mt-4 max-w-lg space-y-6 text-center sm:mt-5">
		<div class="space-y-2">
			<p class="font-mono text-[11px] font-medium tracking-[0.2em] text-primary uppercase">
				{errorMeta.label}
			</p>
			<h1 class="font-display text-2xl font-bold tracking-tight sm:text-3xl">
				{errorMeta.title}
			</h1>
		</div>

		<Separator class="mx-auto w-16" />

		<p class="text-sm leading-relaxed text-muted-foreground sm:text-base">
			{errorMeta.description}
		</p>

		<div class="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
			<Button href="/" size="lg">
				<House class="size-4" />
				<span class="font-mono text-[11px] font-medium tracking-wider uppercase">Back Home</span>
			</Button>
			<Button onclick={() => history.back()} variant="outline" size="lg">
				<ArrowLeft class="size-4" />
				<span class="font-mono text-[11px] font-medium tracking-wider uppercase">Go Back</span>
			</Button>
		</div>
	</div>

	<a
		href="/"
		data-sveltekit-preload-code="viewport"
		class="group mt-12 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
	>
		<span>Or explore the site</span>
		<ArrowRight class="size-3 transition-transform group-hover:translate-x-0.5" />
	</a>
</div>
