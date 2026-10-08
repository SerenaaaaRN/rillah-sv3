<script lang="ts">
	import './layout.css';
	import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
	import { invalidate } from '$app/navigation';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { theme } from '$lib/hooks/theme.svelte';

	let { children, data } = $props();

	theme();
	onMount(() => {
		const { data: listener } = data.supabase.auth.onAuthStateChange(
			(_: AuthChangeEvent, newSession: Session | null) => {
				if (newSession?.expires_at !== data.session?.expires_at) {
					invalidate('supabase:auth');
				}
			}
		);
		return () => listener.subscription.unsubscribe();
	});
</script>

<ModeWatcher />

{@render children()}
