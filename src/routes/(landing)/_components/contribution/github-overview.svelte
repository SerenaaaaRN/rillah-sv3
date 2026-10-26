<script lang="ts">
	import type { GithubCalendar } from '#lib/data/github.js';

	let { data }: { data?: GithubCalendar | null } = $props();

	let totalContributions = $derived(data?.totalContributions ?? 0);
	let weeks = $derived(data?.weeks ?? []);

	let totalThisWeek = $derived(
		weeks[weeks.length - 1]?.contributionDays?.reduce(
			(acc: number, cur: { contributionCount: number }) => acc + cur.contributionCount,
			0
		) ?? 0
	);

	let allCounts = $derived(
		weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount))
	);
	let best = $derived(allCounts.length ? Math.max(...allCounts) : 0);
	let avg = $derived(allCounts.length ? totalContributions / allCounts.length : 0);
</script>

{#snippet statCard(label: string, value: number, unit = '')}
	<div class="border border-border bg-card px-3 py-2">
		<p class="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">{label}</p>
		<p class="mt-0.5 text-lg font-semibold text-foreground">
			{value.toLocaleString()}{#if unit}
				<span class="text-xs font-normal text-muted-foreground"> {unit}</span>
			{/if}
		</p>
	</div>
{/snippet}

<div class="grid grid-cols-2 gap-3 py-2 sm:grid-cols-4">
	{@render statCard('Total', totalContributions)}
	{@render statCard('This Week', totalThisWeek)}
	{@render statCard('Best Day', best)}
	{@render statCard('Average', Math.round(avg * 10) / 10, '/ day')}
</div>
