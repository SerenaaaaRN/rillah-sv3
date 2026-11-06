<script lang="ts">
	import BlurFade from '#lib/components/shared/blur-fade.svelte';
	import * as SectionHeading from '#lib/components/shared/section-heading/index.js';
	import * as Accordion from '#lib/components/ui/accordion/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { groupCareersByCompany, type Career } from '#lib/data/career.js';
	import { IsMobile } from '#lib/hooks/is-mobile.svelte.js';

	let { careers = [] }: { careers?: Career[] } = $props();
	let groups = $derived(groupCareersByCompany(careers));
	const isMobile = new IsMobile();

	const hasDescription = (career: Career) =>
		!!career.subtitle?.trim() &&
		career.subtitle.trim().toLowerCase() !== career.company.trim().toLowerCase();
</script>

{#snippet careerLogo(career: Career, isFirst: boolean)}
	{#if isFirst}
		<img
			src={career.image ?? '/no-image.jpg'}
			alt={`${career.company} logo`}
			width={48}
			height={48}
			class="size-12 shrink-0 rounded-full bg-white object-contain p-1 ring-1 ring-border"
		/>
	{:else}
		<div class="size-12 shrink-0"></div>
	{/if}
{/snippet}

{#snippet timelineDot(isFirst: boolean)}
	{#if !isFirst}
		<div class="absolute top-5 left-5 z-10 h-2 w-2 rounded-full bg-primary"></div>
	{/if}
{/snippet}

{#snippet careerRow(career: Career, isFirst: boolean, asHeading: boolean)}
	<div class="flex w-full max-w-full min-w-0 flex-1 flex-row items-start gap-4 text-pretty">
		{@render careerLogo(career, isFirst)}
		<div class="min-w-0 flex-1">
			<svelte:element
				this={asHeading ? 'h3' : 'span'}
				class="block font-display text-sm leading-snug font-semibold tracking-tight text-foreground sm:text-base"
			>
				{career.title}
			</svelte:element>
			{#if asHeading && career.subtitle?.trim()}
				<p class="mt-0.5 text-xs text-muted-foreground sm:text-sm">
					{career.subtitle}
				</p>
			{/if}
		</div>
		<Badge variant="outline" size="md" class="ml-auto self-start whitespace-nowrap"
			>{career.duration}</Badge
		>
	</div>
{/snippet}

{#snippet careerItemDesktop(career: Career, isFirst: boolean)}
	<div class="relative">
		{@render timelineDot(isFirst)}
		<div class="mt-3">
			{@render careerRow(career, isFirst, true)}
		</div>
	</div>
{/snippet}

{#snippet careerItemMobile(career: Career, isFirst: boolean)}
	<div class="relative">
		{@render timelineDot(isFirst)}

		{#if hasDescription(career)}
			<Accordion.Item value={career.id} class="not-last:border-b-0">
				<Accordion.Trigger
					class="mt-2 w-full max-w-full flex-row items-start gap-4 border-0 p-0 text-left text-pretty hover:no-underline focus-visible:ring-0"
				>
					{@render careerRow(career, isFirst, false)}
				</Accordion.Trigger>
				<Accordion.Content class="pt-1 pb-3 pl-16">
					<p class="max-w-prose text-xs leading-relaxed text-muted-foreground sm:text-sm">
						{career.subtitle}
					</p>
				</Accordion.Content>
			</Accordion.Item>
		{:else}
			<div class="mt-2">
				{@render careerRow(career, isFirst, true)}
			</div>
		{/if}
	</div>
{/snippet}

<BlurFade delay={0.25} inView>
	<div class="mt-10">
		<SectionHeading.Root>
			<SectionHeading.Eyebrow>Career</SectionHeading.Eyebrow>
			<SectionHeading.Title>
				Work <SectionHeading.Accent>Experience</SectionHeading.Accent>
			</SectionHeading.Title>
		</SectionHeading.Root>

		{#if isMobile.current}
			<Accordion.Root type="multiple" class="mt-6 flex w-full flex-col">
				{#each groups as { name, items } (name)}
					<div class="relative">
						{#if items.length > 1}
							<div class="absolute top-14 bottom-2 left-6 w-px bg-border"></div>
						{/if}

						{#each items as career, idx (career.id)}
							{@render careerItemMobile(career, idx === 0)}
						{/each}
					</div>
				{/each}
			</Accordion.Root>
		{:else}
			<div class="mt-6">
				{#each groups as { name, items } (name)}
					<div class="relative">
						{#if items.length > 1}
							<div class="absolute top-14 bottom-2 left-6 w-px bg-border"></div>
						{/if}

						{#each items as career, idx (career.id)}
							{@render careerItemDesktop(career, idx === 0)}
						{/each}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</BlurFade>
