<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		words = [],
		class: className = '',
		duration = 120,
		pauseDelay = 2500,
		loop = true,
		showCursor = true,
		cursorStyle = 'line' as 'line' | 'block' | 'underscore'
	}: {
		words?: string[];
		class?: string;
		duration?: number;
		pauseDelay?: number;
		loop?: boolean;
		showCursor?: boolean;
		cursorStyle?: 'line' | 'block' | 'underscore';
	} = $props();

	let displayedText = $state('');
	let currentWordIndex = $state(0);
	let currentCharIndex = $state(0);
	let phase: 'typing' | 'pause' | 'deleting' = $state('typing');

	function getCursorChar() {
		switch (cursorStyle) {
			case 'block':
				return '▌';
			case 'underscore':
				return '_';
			case 'line':
			default:
				return '|';
		}
	}

	$effect(() => {
		const list = words;
		const typeMs = duration;
		const eraseMs = duration / 2;
		const holdMs = pauseDelay;
		const shouldLoop = loop;
		if (list.length === 0) return;

		let cancelled = false;
		let timer: ReturnType<typeof setTimeout> | undefined;

		const schedule = (ms: number) => {
			clearTimeout(timer);
			timer = setTimeout(tick, ms);
		};

		const tick = () => {
			if (cancelled) return;
			const currentWord = list[currentWordIndex] ?? '';
			const graphemes = Array.from(currentWord);

			if (phase === 'typing') {
				if (currentCharIndex < graphemes.length) {
					currentCharIndex += 1;
					displayedText = graphemes.slice(0, currentCharIndex).join('');
					schedule(typeMs);
				} else if (list.length > 1 || shouldLoop) {
					const isLast = currentWordIndex === list.length - 1;
					if (!isLast || shouldLoop) {
						phase = 'pause';
						schedule(holdMs);
					}
				}
			} else if (phase === 'pause') {
				phase = 'deleting';
				schedule(eraseMs);
			} else if (phase === 'deleting') {
				if (currentCharIndex > 0) {
					currentCharIndex -= 1;
					displayedText = graphemes.slice(0, currentCharIndex).join('');
					schedule(eraseMs);
				} else {
					currentWordIndex = (currentWordIndex + 1) % list.length;
					phase = 'typing';
					schedule(typeMs);
				}
			}
		};

		schedule(typeMs);

		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	});

	const shouldShowCursor = $derived(showCursor);
</script>

<span class={cn('leading-8 tracking-[-0.02em]', className)}>
	{displayedText}
	{#if shouldShowCursor}
		<span class="animate-blink-cursor inline-block">{getCursorChar()}</span>
	{/if}
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
	.animate-blink-cursor {
		animation: blink-cursor 1.2s step-end infinite;
	}
</style>
