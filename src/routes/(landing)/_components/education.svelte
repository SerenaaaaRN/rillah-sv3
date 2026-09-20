<script lang="ts">
	import BlurFade from '$lib/components/shared/blur-fade.svelte';
	import Chip from '$lib/components/shared/chip.svelte';
	import * as SectionHeading from '$lib/components/shared/section-heading';
	import Surface from '$lib/components/shared/surface.svelte';
	import type { Education } from '$lib/data/education.js';

	let { educations = [] }: { educations?: Education[] } = $props();
</script>

{#snippet educationItem(edu: Education)}
	<Surface
		variant="solid"
		padding="compact"
		class="group flex flex-row items-center gap-4 hover:bg-accent/40"
	>
		<img
			src={edu.image ?? '/no-image.jpg'}
			alt={`${edu.title} logo`}
			width={56}
			height={56}
			class="size-14 shrink-0 rounded-full border border-border object-cover"
		/>
		<div class="min-w-0 flex-1">
			<p class="font-display text-sm font-semibold text-foreground">{edu.title}</p>
			<p class="text-xs text-muted-foreground">{edu.subtitle}</p>
		</div>
		<Chip class="ml-auto shrink-0 self-start">{edu.duration}</Chip>
	</Surface>
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
			<div class="mt-6 space-y-3">
				{#each educations as edu (edu.id)}
					{@render educationItem(edu)}
				{/each}
			</div>
		{/if}
	</div>
</BlurFade>
