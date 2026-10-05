import { isBrowser } from '@supabase/ssr';
import { createSupabaseBrowserClient } from '$lib/supabase/client.js';
import { createSupabaseLayoutServerClient } from '$lib/supabase/server.js';
import type { LayoutLoad } from './$types.js';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = isBrowser()
		? createSupabaseBrowserClient(fetch)
		: createSupabaseLayoutServerClient(data.cookies, fetch);

	// getSession is safe here: on the client it reads local storage, on the server
	// it reads the session already validated via safeGetSession in +layout.server.ts.
	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session, user: data.user };
};
