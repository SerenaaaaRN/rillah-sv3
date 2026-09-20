<script lang="ts">
	import type { GithubCalendar } from '$lib/data/github.js';
	import GithubOverviewItem from './github-overview-item.svelte';

	let { data }: { data?: GithubCalendar | null } = $props();

	const totalContributions = $derived(data?.totalContributions ?? 0);
	const weeks = $derived(data?.weeks ?? []);

	const totalThisWeek = $derived(
		weeks[weeks.length - 1]?.contributionDays?.reduce(
			(acc: number, cur: { contributionCount: number }) => acc + cur.contributionCount,
			0
		) ?? 0
	);

	const allCounts = $derived(
		weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount))
	);
	const best = $derived(allCounts.length ? Math.max(...allCounts) : 0);
	const avg = $derived(allCounts.length ? totalContributions / allCounts.length : 0);
</script>

<div class="grid grid-cols-2 gap-3 py-2 sm:grid-cols-4">
	<GithubOverviewItem label="Total" value={totalContributions} />
	<GithubOverviewItem label="This Week" value={totalThisWeek} />
	<GithubOverviewItem label="Best Day" value={best} />
	<GithubOverviewItem label="Average" value={Math.round(avg * 10) / 10} unit="/ day" />
</div>
