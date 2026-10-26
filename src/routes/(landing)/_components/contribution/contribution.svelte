<script lang="ts">
	import BlurFade from '#lib/components/shared/blur-fade.svelte';
	import * as SectionHeading from '#lib/components/shared/section-heading/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import type { GithubCalendar } from '#lib/data/github.js';
	import GithubCalendarView from './github-calendar.svelte';
	import GithubOverview from './github-overview.svelte';

	let { github }: { github: GithubCalendar } = $props();
</script>

<BlurFade delay={0.25} inView>
	<div class="mt-10">
		<SectionHeading.Root class="mb-6">
			<SectionHeading.Eyebrow>Activity</SectionHeading.Eyebrow>
			<SectionHeading.Title as="h3">
				@SerenaaaaRN's <SectionHeading.Accent>contributions</SectionHeading.Accent>
			</SectionHeading.Title>
			<SectionHeading.Description>
				Coding hours, GitHub streaks, and learning stats pulled live from around the web.
			</SectionHeading.Description>
		</SectionHeading.Root>
		<div class="mb-4 flex items-center gap-2">
			<Badge
				variant="outline"
				size="md"
				class="border-foreground/20 bg-card text-foreground"
				title="Live data from GitHub"
			>
				<span class="size-1.5 rounded-full bg-emerald-500" aria-hidden="true"></span>
				Live GitHub
			</Badge>
		</div>
		<GithubOverview data={github} />
		<GithubCalendarView data={github} />
	</div>
</BlurFade>
