<script lang="ts">
	import ChatText from 'phosphor-svelte/lib/ChatText';
	import { Card, CardContent } from '$lib/components/ui/card/index.js';
	import type { GuestbookEntry } from '$lib/schema/guestbook.js';
	import { timeAgo } from '$lib/utils/date.js';

	interface Props {
		entries?: GuestbookEntry[];
	}

	let { entries = [] }: Props = $props();
</script>

<div class="space-y-3">
	<p class="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
		Comments — {entries.length}
	</p>
	{#if entries.length === 0}
		<Card class="rounded-none border-dashed">
			<CardContent class="py-10 text-center">
				<ChatText class="mx-auto mb-3 size-8 text-muted-foreground/40" />
				<p class="text-sm text-muted-foreground">No comments yet — be the first!</p>
			</CardContent>
		</Card>
	{:else}
		<div class="flex max-h-100 flex-col gap-3 overflow-y-auto pr-2">
			{#each entries as entry (entry.id)}
				<div class="flex gap-3 border border-border bg-card p-4">
					<div
						class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground"
					>
						{entry.name.slice(0, 2).toUpperCase()}
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-baseline gap-2">
							<span class="font-display text-sm font-semibold">{entry.name}</span>
							<span class="font-mono text-[11px] text-muted-foreground"
								>{timeAgo(entry.created_at)}</span
							>
							{#if entry.id.startsWith('optimistic-')}
								<span class="font-mono text-[10px] text-muted-foreground italic">sending…</span>
							{/if}
						</div>
						<p
							class="mt-1.5 text-sm leading-relaxed text-pretty wrap-break-word whitespace-pre-wrap"
						>
							{entry.message}
						</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
