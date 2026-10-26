<script lang="ts">
	import type { GithubCalendar } from '#lib/data/github.js';
	import { cn } from '#lib/utils.js';

	let { data }: { data?: GithubCalendar | null } = $props();

	const CELL_SIZE_PX = 12;
	const WEEK_COLUMN_PX = CELL_SIZE_PX + 3;

	let selected: { count: number | null; date: string | null } = $state({ count: null, date: null });

	function scrollToEnd(node: HTMLDivElement): void {
		node.scrollLeft = node.scrollWidth;
	}

	const weeks = $derived(data?.weeks ?? []);
	const months = $derived(
		(data?.months ?? []).map((month) => {
			const filterDays = weeks
				.filter((w) => w.firstDay.slice(0, 7) === month.firstDay.slice(0, 7))
				.flatMap((w) => w.contributionDays);
			const contributionsCount = filterDays.reduce((acc, cur) => acc + cur.contributionCount, 0);
			return { ...month, contributionsCount };
		})
	);
	const colors = $derived(data?.colors ?? []);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (scrollable region needs keyboard access for horizontal scroll) -->
<div
	{@attach scrollToEnd}
	tabindex={0}
	role="region"
	aria-label="GitHub contribution calendar"
	class="w-full min-w-0 overflow-x-auto overscroll-x-contain pb-1"
>
	<div class="flex w-max min-w-full flex-col">
		<ul class="flex gap-0.75 text-xs text-muted-foreground">
			{#each months as month (month.firstDay)}
				<li
					class={cn(month.totalWeeks < 2 && 'invisible')}
					style:min-width={`${WEEK_COLUMN_PX * month.totalWeeks}px`}
				>
					{month.name}
				</li>
			{/each}
		</ul>

		<div class="flex gap-0.75 py-0.5">
			{#each weeks as week (week.firstDay)}
				<div class="flex w-3 shrink-0 flex-col">
					{#each week.contributionDays as day (day.date)}
						{@const bg = day.contributionCount > 0 && day.color ? day.color : undefined}
						<span
							class="my-0.5 block h-3 w-3 rounded-none bg-muted transition-transform duration-150 hover:scale-125"
							style={bg ? `background-color: ${bg}` : undefined}
							onmouseenter={() => (selected = { count: day.contributionCount, date: day.date })}
							onmouseleave={() => (selected = { count: null, date: null })}
							role="img"
							aria-label={`${day.contributionCount} contributions on ${day.date}`}
						></span>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<div class="flex flex-wrap items-center justify-between gap-2">
	<div class="flex items-center gap-2 text-sm">
		<span class="text-muted-foreground">Less</span>
		<ul class="flex gap-1">
			<li class="h-2.5 w-2.5 rounded-none bg-muted"></li>
			{#each colors as c (c)}
				<li class="h-2.5 w-2.5 rounded-none" style:background-color={c}></li>
			{/each}
		</ul>
		<span>More</span>
	</div>
	<div
		class={cn(
			selected.date ? 'opacity-100' : 'opacity-0',
			'rounded-none bg-muted px-2 text-sm transition-opacity duration-200'
		)}
	>
		{selected.count} contributions on {selected.date}
	</div>
</div>
