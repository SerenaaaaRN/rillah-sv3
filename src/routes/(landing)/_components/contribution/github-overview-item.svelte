<script lang="ts">
	let { label, value, unit = '' }: { label: string; value: number; unit?: string } = $props();
</script>

<div class="border border-border bg-card px-3 py-2">
	<p class="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">{label}</p>
	<p class="mt-0.5 text-lg font-semibold text-green-600">
		{value.toLocaleString()}{#if unit}
			<span class="text-xs font-normal text-muted-foreground"> {unit}</span>
		{/if}
	</p>
</div>
