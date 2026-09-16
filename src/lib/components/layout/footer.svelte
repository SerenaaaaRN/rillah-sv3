<script lang="ts">
	import Eyebrow from '$lib/components/shared/eyebrow.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';

	const year = new Date().getFullYear();
	const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
		{
			heading: 'Explore',
			links: [
				{ label: 'Projects', href: '/projects' },
				{ label: 'Blog', href: '/blog' },
				{ label: 'Changelog', href: '/changelog' }
			]
		}
	];
</script>

<footer data-slot="footer" class="w-full pt-10 pb-10">
	<Separator class="mb-10" />
	<div class="flex flex-col gap-10 md:flex-row md:justify-between">
		<div class="max-w-xs">
			<p class="font-display text-lg font-bold tracking-tight">Rillah</p>
			<p class="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
				AI engineer
			</p>
			<p class="mt-4 font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
				© {year} Rillah
			</p>
		</div>

		<div class="flex flex-col gap-8">
			{#each COLUMNS as col (col.heading)}
				<div class="flex flex-col gap-3">
					<Eyebrow>{col.heading}</Eyebrow>
					<ul class="flex flex-col gap-2">
						{#each col.links as link (link.href)}
							<li>
								<a
									href={link.href}
									class="text-sm text-muted-foreground transition-colors hover:text-primary"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</footer>
