<script lang="ts">
	import { cn } from '#lib/utils.js';

	interface Props {
		words?: string[];
		class?: string;
		typeSpeed?: number;
		deleteSpeed?: number;
		pauseDelay?: number;
		loop?: boolean;
		showCursor?: boolean;
		cursorStyle?: 'line' | 'block' | 'underscore';
		ariaLabel?: string;
	}

	let {
		words = [],
		class: className = '',
		typeSpeed = 120,
		deleteSpeed = 80,
		pauseDelay = 2500,
		loop = true,
		showCursor = true,
		cursorStyle = 'line',
		ariaLabel
	}: Props = $props();

	let displayedText = $state('');
	let currentWordIndex = $state(0);
	let currentCharIndex = $state(0);
	let phase: 'typing' | 'pause' | 'deleting' = $state('typing');

	const cursorChar = $derived(
		cursorStyle === 'block' ? '▌' : cursorStyle === 'underscore' ? '_' : '|'
	);

	// Segmenter untuk handle emoji/grapheme cluster dengan benar
	const segmenter =
		typeof Intl !== 'undefined' ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;

	function getGraphemes(str: string): string[] {
		if (segmenter) {
			return [...segmenter.segment(str)].map((s) => s.segment);
		}
		return Array.from(str);
	}

	$effect(() => {
		const list = words;
		if (list.length === 0) {
			displayedText = '';
			return;
		}

		// reset state saat words berubah
		currentWordIndex = 0;
		currentCharIndex = 0;
		phase = 'typing';
		displayedText = '';

		let cancelled = false;
		let timer: ReturnType<typeof setTimeout> | undefined;

		const schedule = (ms: number) => {
			clearTimeout(timer);
			timer = setTimeout(tick, ms);
		};

		const tick = () => {
			if (cancelled) return;

			const word = list[currentWordIndex] ?? '';
			const graphemes = getGraphemes(word);

			if (phase === 'typing') {
				if (currentCharIndex < graphemes.length) {
					currentCharIndex++;
					displayedText = graphemes.slice(0, currentCharIndex).join('');
					schedule(typeSpeed);
				} else {
					// Selesai mengetik
					const isLast = currentWordIndex >= list.length - 1;
					if (!isLast || loop) {
						phase = 'pause';
						schedule(pauseDelay);
					}
					// Jika !loop && isLast → berhenti total (tidak schedule lagi)
				}
			} else if (phase === 'pause') {
				phase = 'deleting';
				schedule(deleteSpeed);
			} else if (phase === 'deleting') {
				if (currentCharIndex > 0) {
					currentCharIndex--;
					displayedText = graphemes.slice(0, currentCharIndex).join('');
					schedule(deleteSpeed);
				} else {
					currentWordIndex = (currentWordIndex + 1) % list.length;
					phase = 'typing';
					schedule(typeSpeed);
				}
			}
		};

		schedule(typeSpeed);

		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	});

	const fullText = $derived(words.join(', '));
</script>

<span class={cn('leading-8 tracking-[-0.02em]', className)}>
	<span aria-hidden="true">
		{displayedText}
		{#if showCursor}
			<span class="inline-block animate-[blink-cursor_1.2s_step-end_infinite]">{cursorChar}</span>
		{/if}
	</span>

	<span class="sr-only">
		{ariaLabel ?? fullText}
	</span>
</span>

<style>
	@keyframes blink-cursor {
		0%,
		49% {
			opacity: 1;
		}
		50%,
		100% {
			opacity: 0;
		}
	}
</style>
