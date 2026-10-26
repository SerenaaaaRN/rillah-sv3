<script lang="ts">
	import { page } from '$app/state';
	import * as Breadcrumb from '#lib/components/ui/breadcrumb/index.js';

	const segments = $derived(page.url.pathname.split('/').filter(Boolean));

	const segmentToLabel = (segment: string): string => {
		return segment
			.split('-')
			.map((word) => {
				if (word.length <= 2) return word.toUpperCase();
				return word.charAt(0).toUpperCase() + word.slice(1);
			})
			.join(' ');
	};
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			{#if segments.length === 0}
				<Breadcrumb.Page>Dashboard</Breadcrumb.Page>
			{:else}
				<Breadcrumb.Link href="/admin">Dashboard</Breadcrumb.Link>
			{/if}
		</Breadcrumb.Item>

		{#each segments as segment, index (index)}
			{@const href = `/${segments.slice(0, index + 1).join('/')}`}
			{@const label = segmentToLabel(segment)}
			{@const isLast = index === segments.length - 1}

			<Breadcrumb.Separator />

			<Breadcrumb.Item>
				{#if isLast}
					<Breadcrumb.Page>{label}</Breadcrumb.Page>
				{:else}
					<Breadcrumb.Link {href}>{label}</Breadcrumb.Link>
				{/if}
			</Breadcrumb.Item>
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
