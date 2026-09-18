<script lang="ts">
	import './layout.css';
	import { invalidate } from '$app/navigation';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { useTheme } from '$lib/hooks/useTheme.svelte';

	let { children, data } = $props();

	useTheme();
	onMount(() => {
		const { data: listener } = data.supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== data.session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => listener.subscription.unsubscribe();
	});
</script>

<ModeWatcher />

{@render children()}
