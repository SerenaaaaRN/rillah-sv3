import type { Handle } from '@sveltejs/kit/hooks';
import { createSupabaseServerClient } from '#lib/supabase/ssr.js';

const seoRedirect = (url: URL, method: string): Response | null => {
	if (method !== 'GET' && method !== 'HEAD') return null;

	const { pathname, search } = url;
	const collapsed = pathname.replace(/^\/+/, '/');
	const lower = collapsed.toLowerCase();
	const normalized = lower === '/' ? lower : lower.replace(/\/+$/, '') || '/';

	if (normalized === pathname) return null;

	const target = new URL(url);
	target.pathname = normalized;
	target.search = search;

	return new Response(null, { status: 301, headers: { location: target.toString() } });
};

export const handle: Handle = async ({ event, resolve }) => {
	const redirect = seoRedirect(event.url, event.request.method);
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
