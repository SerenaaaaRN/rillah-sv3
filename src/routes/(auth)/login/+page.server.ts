import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types.js';

const LoginSchema = z.object({
	email: z.string().min(1, 'Email wajib diisi.').email('Email tidak valid.'),
	password: z.string().min(1, 'Password wajib diisi.'),
	redirectTo: z.string().optional().default('/admin')
});

/** Allow only same-site relative paths (rejects open redirects like `//evil.com`). */
const safeRedirectTo = (path: string): string => {
	return path.startsWith('/') && !path.startsWith('//') && !path.includes('\\') ? path : '/admin';
};

export const load: PageServerLoad = async ({ locals, url }) => {
	const { session } = await locals.safeGetSession();
	const redirectTo = safeRedirectTo(url.searchParams.get('redirectTo') ?? '/admin');
	if (session) throw redirect(303, redirectTo);
	return { redirectTo };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const parsed = LoginSchema.safeParse({
			email: String(formData.get('email') ?? ''),
			password: String(formData.get('password') ?? ''),
			redirectTo: String(formData.get('redirectTo') ?? '/admin')
		});

		if (!parsed.success) {
			const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
			return fail(400, {
				status: 'error',
				message: firstError ?? 'Validasi gagal.',
				email: String(formData.get('email') ?? '')
			});
		}

		const { error } = await locals.supabase.auth.signInWithPassword({
			email: parsed.data.email,
			password: parsed.data.password
		});

		if (error) {
			return fail(400, {
				status: 'error',
				message:
					error.message === 'Invalid login credentials'
						? 'Email atau password salah.'
						: error.message,
				email: parsed.data.email
			});
		}

		throw redirect(303, safeRedirectTo(parsed.data.redirectTo));
	}
};
