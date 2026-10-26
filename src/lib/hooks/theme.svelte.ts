import { setMode, userPrefersMode } from 'mode-watcher';
import { SvelteDate } from 'svelte/reactivity';

type Mode = 'light' | 'dark' | 'system';

export const theme = (themes: Mode[] = ['light', 'dark']) => {
	if (typeof window !== 'undefined') {
		const hour = new SvelteDate().getHours();
		setMode(hour >= 6 && hour < 18 ? 'light' : 'dark');
	}

	$effect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;
			if (
				target.isContentEditable ||
				target.closest('input, textarea, select, button, a[href], [tabindex]:not([tabindex="-1"])')
			) {
				return;
			}

			if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.metaKey && !e.altKey) {
				e.preventDefault();

				const currentMode = (userPrefersMode.current ?? 'light') as Mode;
				const currentIndex = themes.indexOf(currentMode);

				const safeIndex = currentIndex === -1 ? 0 : currentIndex;
				const nextIndex = (safeIndex + 1) % themes.length;

				setMode(themes[nextIndex]);
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
};
