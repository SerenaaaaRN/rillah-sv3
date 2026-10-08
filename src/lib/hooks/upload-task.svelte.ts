import { uploadPublicFile } from '$lib/supabase/client.js';
import { formatBytes, mb } from '$lib/utils/bytes.js';
import { errorMessage } from '$lib/utils/error.js';

export interface UploadTaskOptions {
	bucket: string;
	slug?: string | (() => string);
	folder?: string;
	/** Upload policy preset. Drives the default limit + mime check. Defaults to 'image'. */
	kind?: 'image' | 'video';
	maxBytes?: number;
	mimePrefix?: string;
}

/**
 * Reactive single-concern upload task: pending counter, error string,
 * pre-validation, and the Supabase transport call.
 *
 * Upload limits live here (owned by the hook): `kind: 'video'` allows
 * 50MB + `video/*`, everything else defaults to 5MB + `image/*`.
 */
export const uploadTask = ({
	bucket,
	slug = 'temp',
	folder,
	kind = 'image',
	maxBytes,
	mimePrefix
}: UploadTaskOptions) => {
	let pending = $state(0);
	let error = $state('');
	const uploading = $derived(pending > 0);

	const limit = maxBytes ?? mb(kind === 'video' ? 50 : 5);
	const prefix = mimePrefix ?? `${kind}/`;

	const resolveSlug = (): string | undefined => (typeof slug === 'function' ? slug() : slug);

	const upload = async (file: File): Promise<string | null> => {
		if (!file.type.startsWith(prefix)) {
			error = `Only ${prefix}* allowed.`;
			return null;
		}
		if (file.size > limit) {
			error = `File too large. Max ${formatBytes(limit)}.`;
			return null;
		}
		pending += 1;
		error = '';
		try {
			return await uploadPublicFile(bucket, file, {
				slug: resolveSlug(),
				folder,
				maxBytes: limit
			});
		} catch (e) {
			error = errorMessage(e);
			return null;
		} finally {
			pending -= 1;
		}
	};

	const reset = () => {
		error = '';
	};

	return {
		get uploading() {
			return uploading;
		},
		get error() {
			return error;
		},
		upload,
		reset
	};
};
