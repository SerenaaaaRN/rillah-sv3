<script lang="ts">
	import BlurFade from '$lib/components/shared/blur-fade.svelte';
	import { SCENES } from '$lib/data/scrolltelling.js';
	import { cn } from '$lib/utils.js';
</script>

<section aria-label="How I work" class="mx-auto mt-16 max-w-4xl space-y-10 md:mt-24 md:space-y-14">
	{#each SCENES as scene, i (scene.id)}
		{@const flipped = i % 2 === 1}
		<BlurFade inView delay={0}>
			<figure
				class={cn(
					'relative m-0 overflow-hidden bg-muted md:w-2/3',
					flipped ? 'md:ml-auto' : 'md:mr-auto'
				)}
			>
				<img
					src={scene.image}
					alt={`Visual representation of ${scene.focus}`}
					loading="lazy"
					class="h-72 w-full object-cover mix-blend-luminosity brightness-[0.9] contrast-[1.12] grayscale md:h-96 dark:brightness-[0.7]"
				/>
				<div
					aria-hidden="true"
					class="absolute inset-0 bg-linear-to-t from-background via-background/45 to-transparent"
				></div>
				<div
					class={cn(
						'absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-8',
						flipped ? 'items-end text-right' : 'items-start text-left'
					)}
				>
					<p
						class="font-mono text-[10px] font-semibold tracking-[0.3em] text-muted-foreground uppercase"
					>
						{scene.focus}
					</p>
					<h2
						class="max-w-xl font-display text-lg leading-snug font-normal tracking-tight text-balance md:text-2xl"
					>
						{scene.text}
					</h2>
				</div>
			</figure>
		</BlurFade>
	{/each}
</section>
