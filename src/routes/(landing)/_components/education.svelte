<script lang="ts">
	import GraduationCap from 'phosphor-svelte/lib/GraduationCap';
	import BlurFade from '#lib/components/shared/blur-fade.svelte';
	import * as SectionHeading from '#lib/components/shared/section-heading/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Card, CardContent } from '#lib/components/ui/card/index.js';
	import type { Education } from '#lib/data/education.js';

	let { educations = [] }: { educations?: Education[] } = $props();
</script>

{#snippet educationItem(edu: Education)}
	<Card size="sm" class="rounded-none border border-border shadow-none ring-0">
		<CardContent class="flex-row items-start gap-4">
			{#if edu.image}
				<img
					src={edu.image}
					alt={`${edu.title} logo`}
					width={48}
					height={48}
					class="size-12 shrink-0 rounded-full bg-white object-contain p-1 ring-1 ring-border"
				/>
			{:else}
				<div
					class="flex size-12 shrink-0 items-center justify-center rounded-full bg-white p-1 ring-1 ring-border"
				>
					<GraduationCap class="size-6 text-muted-foreground" aria-hidden="true" />
				</div>
			{/if}
			<div class="min-w-0 flex-1">
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
					{edu.subtitle}
				</p>
				<h3
					class="mt-1 line-clamp-2 font-display text-sm font-semibold tracking-tight text-pretty text-foreground sm:text-base"
				>
					{edu.title}
				</h3>
				<Badge variant="outline" size="md" class="mt-2 whitespace-nowrap">
					{edu.duration}
				</Badge>
			</div>
		</CardContent>
	</Card>
{/snippet}

<BlurFade delay={0.25} inView>
	<div class="mt-10">
		<SectionHeading.Root>
			<SectionHeading.Eyebrow>Education</SectionHeading.Eyebrow>
			<SectionHeading.Title>
				Academic <SectionHeading.Accent>foundation</SectionHeading.Accent>
			</SectionHeading.Title>
			<SectionHeading.Description>
				Where I built the fundamentals behind the work.
			</SectionHeading.Description>
		</SectionHeading.Root>

		{#if educations.length > 0}
			<div class="mt-6 grid gap-3 md:grid-cols-2">
				{#each educations as edu (edu.id)}
					{@render educationItem(edu)}
				{/each}
			</div>
		{/if}
	</div>
</BlurFade>
