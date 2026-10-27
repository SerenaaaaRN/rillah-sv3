import { isBrowser } from '@supabase/ssr';
import { createSupabaseBrowserClient } from '#lib/supabase/client.js';
import { createSupabaseLayoutServerClient } from '#lib/supabase/ssr.js';
import type { LayoutLoad } from './$types.js';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = isBrowser()
		? createSupabaseBrowserClient(fetch)
		: createSupabaseLayoutServerClient(data.cookies, fetch);

	return { supabase, session: data.session, user: data.user };
};
