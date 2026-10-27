import { fail } from '@sveltejs/kit';
import { GuestbookSchema } from '#lib/schema/guestbook.js';
import { insertGuestbook, listCertifications, listGuestbook } from '#lib/server/content.js';
import { fetchGithubCalendar } from '#lib/server/github.js';
import { createStaticClient } from '#lib/supabase/static.js';
import { formDataToRecord } from '#lib/utils/form.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const supabase = createStaticClient();
	const [certifications, guestbook] = await Promise.all([
		listCertifications(supabase),
		listGuestbook(supabase)
	]);

	return {
		github: fetchGithubCalendar(),
		certifications,
		guestbook
	};
};

export const actions: Actions = {
	guestbook: async ({ request }) => {
		const record = formDataToRecord(await request.formData());

		// Honeypot: treat bots as a normal success so they do not learn they were caught.
		if (record.website) return { success: true };

		const parsed = GuestbookSchema.safeParse({
			name: record.name?.trim(),
			message: record.message?.trim()
		});
		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0]?.message ?? 'Invalid input'
			});
		}

		const dbError = await insertGuestbook(createStaticClient(), parsed.data);
		if (dbError) {
			console.error('[landing] guestbook insert failed:', dbError);
			return fail(500, { error: 'Something went wrong. Please try again later.' });
		}

		return { success: true };
	}
};
