import type { Handle } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase/server.js';

function seoRedirect(url: URL): Response | null {
	const original = url.pathname;
	const lower = original.toLowerCase();

	if (lower !== original) {
		return Response.redirect(new URL(lower + url.search, url), 301);
	}

	const normalized = lower !== '/' ? lower.replace(/\/+$/, '') : lower;
	if (normalized !== lower) {
		return Response.redirect(new URL(normalized + url.search, url), 301);
	}

	return null;
}

export const handle: Handle = async ({ event, resolve }) => {
	const redirect = seoRedirect(event.url);
	if (redirect) return redirect;

	const supabase = createSupabaseServerClient(event);

	event.locals.supabase = supabase;

	event.locals.safeGetSession = async () => {
		const hasSessionCookie = event.cookies
			.getAll()
			.some((c) => c.name.startsWith('sb-') && c.name.includes('auth-token'));
		if (!hasSessionCookie) return { session: null, user: null };

		const {
			data: { user },
			error
		} = await supabase.auth.getUser();
		if (error || !user) return { session: null, user: null };

		const {
			data: { session }
		} = await supabase.auth.getSession();
		return { session, user };
	};

	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
