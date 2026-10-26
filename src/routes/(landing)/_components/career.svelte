<script lang="ts">
	import BlurFade from '#lib/components/shared/blur-fade.svelte';
	import * as SectionHeading from '#lib/components/shared/section-heading/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { groupCareersByCompany, type Career } from '#lib/data/career.js';

	let { careers = [] }: { careers?: Career[] } = $props();

	let groups = $derived(groupCareersByCompany(careers));
</script>

{#snippet careerItem(career: Career, isFirst: boolean)}
	<div class="relative">
		{#if !isFirst}
			<div class="absolute top-5 left-5 z-10 h-2 w-2 rounded-full bg-primary"></div>
		{/if}
		<div class="mt-3 flex max-w-full flex-row items-start gap-4 text-pretty">
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
			<div class="flex-1">
				<h3
					class="font-display text-sm leading-snug font-semibold tracking-tight text-foreground sm:text-base"
				>
					{career.title}
				</h3>
				<p class="mt-0.5 text-xs text-muted-foreground sm:text-sm">
					{career.subtitle}
				</p>
			</div>
			<Badge variant="outline" size="md" class="ml-auto self-start whitespace-nowrap"
				>{career.duration}</Badge
			>
		</div>
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

		{#if groups.length > 0}
			<div class="mt-6">
				{#each groups as { name, items } (name)}
					<div class="relative">
						{#if items.length > 1}
							<div class="absolute top-14 bottom-4 left-6 w-px bg-border"></div>
						{/if}

						{#each items as career, idx (career.id)}
							{@render careerItem(career, idx === 0)}
						{/each}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</BlurFade>
