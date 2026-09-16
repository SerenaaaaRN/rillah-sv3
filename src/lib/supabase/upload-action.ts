import { fail, type RequestEvent } from '@sveltejs/kit';
import { uploadToBucket } from './upload.js';

export type UploadActionOptions = {
	bucket: string;
	maxBytes: number;
	mimePrefix: 'image/' | 'video/';
	kindLabel: string;
	/** Optional folder prefix inside the bucket (e.g. `videos`). */
	folder?: string;
};

/**
 * Shared form-action factory for uploading a single `file` (+ `slug`)
 * to a Supabase Storage bucket. Returns `{ publicUrl }` on success
 * or `fail(...)` with the underlying message so the client can surface it.
 */
export function createUploadAction({ bucket, maxBytes, mimePrefix, kindLabel, folder }: UploadActionOptions) {
	return async ({ request, locals }: RequestEvent) => {
		const form = await request.formData();
		const file = form.get('file');
		const slug = String(form.get('slug') ?? 'temp');

		if (!(file instanceof File) || file.size === 0) return fail(400, { error: 'No file.' });
		if (!file.type.startsWith(mimePrefix))
			return fail(400, { error: `Only ${kindLabel} allowed.` });

		try {
			const publicUrl = await uploadToBucket(locals.supabase, bucket, slug, file, maxBytes, folder);
			return { publicUrl };
		} catch (e) {
			console.error('[upload] failed:', e);
			return fail(500, { error: e instanceof Error ? e.message : 'Upload failed.' });
		}
	};
}
