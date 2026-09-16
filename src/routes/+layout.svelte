<script lang="ts">
	import './layout.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children, data } = $props();

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
