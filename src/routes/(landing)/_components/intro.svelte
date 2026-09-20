<script lang="ts">
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import BlurFade from '$lib/components/shared/blur-fade.svelte';
	import Eyebrow from '$lib/components/shared/eyebrow.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { media_socials } from '$lib/data/social.js';
	import TypingAnimation from './typing-animation.svelte';

	const roles = ['CS Students', 'NLP & Deep Learning Explorer', 'AI Systems'];

	const HERO_STATS = [
		{ label: 'Current Focus', value: 'NLP & LLM Systems' },
		{ label: 'Stack', value: 'TS, Python' },
		{ label: 'Ecosystem', value: 'PyTorch · HuggingFace' },
		{ label: 'Availability', value: 'Open to Collab' }
	];
</script>

<section class="flex flex-col-reverse gap-8">
	<BlurFade delay={0.1} inView>
		<div class="space-y-5 text-left">
			<div class="animate-fade-in-up" style="animation-delay: 0ms">
				<Eyebrow>Open to work</Eyebrow>
			</div>

			<div class="animate-fade-in-up" style="animation-delay: 100ms">
				<h1
					class="font-display text-3xl leading-[1.05] font-bold tracking-tight text-balance sm:text-4xl md:text-5xl"
				>
					Hi, I'm Rillah<em class="font-serif text-3xl text-primary italic sm:text-4xl md:text-5xl"
						>.</em
					>
				</h1>
			</div>

			<!-- typing -->
			<div class="animate-fade-in-up" style="animation-delay: 200ms">
				<div class="flex min-w-0 items-center gap-2 text-sm">
					<span class="shrink-0 text-muted-foreground">I'm a</span>
					<TypingAnimation
						words={roles}
						class="min-w-0 text-base font-semibold text-primary md:text-lg"
						duration={120}
						pauseDelay={2500}
					/>
				</div>
			</div>

			<!-- Bio -->
			<div class="animate-fade-in-up" style="animation-delay: 300ms">
				<p class="max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
					CS undergraduate diving deep into applied Deep Learning, NLP, and modern LLM
					architectures. Currently experimenting with model fine-tuning (PEFT / QLoRA), retrieval
					systems (RAG), and turning transformer models into scalable software using Python
				</p>
			</div>

			<!-- CTA -->
			<div class="animate-fade-in-up" style="animation-delay: 400ms">
				<div class="flex flex-wrap gap-3">
					<Button href="/projects">
						View My Work
						<ArrowRight class="size-4" />
					</Button>
					<Button variant="outline" href="/blog">View My Blog</Button>
				</div>
			</div>

			<!-- Social -->
			<div class="animate-fade-in-up" style="animation-delay: 500ms">
				<div class="flex min-w-0 flex-wrap items-center gap-3">
					<Eyebrow>Find me on</Eyebrow>
					<div class="flex flex-wrap items-center gap-2">
						{#each media_socials as social (social.title)}
							<a
								href={social.href}
								target="_blank"
								rel="noopener noreferrer"
								class="rounded-lg border border-border bg-background p-2.5 transition-colors hover:border-foreground/20 hover:bg-accent hover:text-primary"
								title={social.title}
							>
								<social.icon class="size-4" />
							</a>
						{/each}
					</div>
				</div>
			</div>

			<!-- Stat strip -->
			<div class="animate-fade-in-up" style="animation-delay: 600ms">
				<dl class="grid grid-cols-2 border-y border-border sm:grid-cols-4">
					{#each HERO_STATS as item (item.label)}
						<div
							class="flex min-w-0 flex-col gap-1 border-border px-3 py-5 not-last:border-r sm:px-4"
						>
							<dt class="font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
								{item.label}
							</dt>
							<dd
								class="font-display text-xl font-bold tracking-tight wrap-break-word tabular-nums sm:text-2xl md:text-3xl"
							>
								{item.value}
							</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>
	</BlurFade>

	<BlurFade delay={0.1} inView class="flex justify-center md:hidden">
		<div class="relative w-fit">
			<div class="absolute inset-0 rounded-full bg-primary/10 blur-2xl"></div>
			<img
				src="/rillah.jpeg"
				alt="rillah"
				width={200}
				height={200}
				class="relative size-28 rounded-full object-cover shadow-xl ring-2 ring-border ring-offset-2 ring-offset-background md:size-40 lg:size-48"
			/>
			<div class="absolute right-2 bottom-2 md:right-3 md:bottom-3">
				<span class="relative flex h-3 w-3 md:h-4 md:w-4">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"
					></span>
					<span
						class="relative inline-flex h-3 w-3 rounded-full bg-green-500 ring-2 ring-background md:h-4 md:w-4"
					></span>
				</span>
			</div>
		</div>
	</BlurFade>
</section>
