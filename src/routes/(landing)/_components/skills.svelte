<script lang="ts">
	import CaretDown from 'phosphor-svelte/lib/CaretDown';
	import CaretUp from 'phosphor-svelte/lib/CaretUp';
	import BlurFade from '$lib/components/shared/blur-fade.svelte';
	import Chip from '$lib/components/shared/chip.svelte';
	import * as SectionHeading from '$lib/components/shared/section-heading';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import {
		skills_data,
		skills_data_bottom,
		skills_data_top,
		skillsStats
	} from '$lib/data/skills.js';
	import Marquee from './marquee.svelte';

	let showDetailed = $state(false);
</script>

<BlurFade delay={0.25} inView>
	<div class="mt-10">
		<div class="mb-6 flex items-start justify-between gap-4">
			<SectionHeading.Root>
				<SectionHeading.Eyebrow>Toolkit</SectionHeading.Eyebrow>
				<SectionHeading.Title
					>Skills<SectionHeading.Accent>& stack</SectionHeading.Accent></SectionHeading.Title
				>
				<SectionHeading.Description
					>{skillsStats.totalSkills} skills across {skillsStats.totalCategories} categories.</SectionHeading.Description
				>
			</SectionHeading.Root>
			<Button
				variant="outline"
				size="sm"
				onclick={() => (showDetailed = !showDetailed)}
				class="flex shrink-0 items-center gap-2"
			>
				{#if showDetailed}
					<CaretUp class="h-4 w-4" />
					Show Less
				{:else}
					<CaretDown class="h-4 w-4" />
					Show All
				{/if}
			</Button>
		</div>

		<div class="relative mb-8 w-full flex-col">
			<Marquee class="[--duration:25s]">
				{#each skills_data_top as skill (skill)}
					<Chip class="mx-1">{skill}</Chip>
				{/each}
			</Marquee>
			<Marquee reverse class="[--duration:25s]">
				{#each skills_data_bottom as skill (skill)}
					<Chip class="mx-1">{skill}</Chip>
				{/each}
			</Marquee>
		</div>

		{#if showDetailed}
			<div class="grid animate-fade-in-up grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
				{#each skills_data as category (category.name)}
					<Card class="h-full hover:border-foreground/20">
						<CardHeader class="p-4 pb-3">
							<CardTitle
								class="flex items-center justify-between gap-2 font-display text-sm font-bold tracking-tight"
							>
								{category.name}
								<Chip>{category.skills.length}</Chip>
							</CardTitle>
						</CardHeader>
						<CardContent class="p-4 pt-0">
							<div class="flex flex-wrap gap-1.5">
								{#each category.skills as skill (skill)}
									<Chip>{skill}</Chip>
								{/each}
							</div>
						</CardContent>
					</Card>
				{/each}
			</div>
		{/if}
	</div>
</BlurFade>
