import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from './types.js';

export function createSupabaseServerClient(event: RequestEvent) {
	return createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});
}

type LayoutCookies = { name: string; value: string }[];

/**
 * Read-only client for `+layout.ts` SSR. Session was already validated
 * via `safeGetSession` in `+layout.server.ts`, so only `getAll` is needed.
 */
export function createSupabaseLayoutServerClient(cookies: LayoutCookies, fetchFn: typeof fetch) {
	return createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		global: { fetch: fetchFn },
		cookies: {
			getAll() {
				return cookies;
			}
		}
	});
}
