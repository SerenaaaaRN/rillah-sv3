import { uploadPublicFile } from '#lib/supabase/client.js';
import { formatBytes, mb } from '#lib/utils/bytes.js';
import { errorMessage } from '#lib/utils/error.js';
import { compressImage, type CompressImageOptions } from '#lib/utils/image.js';

export interface UploadTaskOptions {
	bucket: string;
	slug?: string | (() => string);
	/** Upload policy preset. Drives the default limit + mime check. Defaults to 'image'. */
	kind?: 'image' | 'video';
	maxBytes?: number;
	mimePrefix?: string;
	compress?: boolean | CompressImageOptions;
}

/**
 * Reactive single-concern upload task: pending counter, error string,
 * pre-validation, and the Supabase transport call.
 */
export const uploadTask = ({
	bucket,
	slug = 'temp',
	kind = 'image',
	maxBytes,
	mimePrefix,
	compress
}: UploadTaskOptions) => {
	let pending = $state(0);
	let error = $state('');
	const uploading = $derived(pending > 0);

	const limit = maxBytes ?? mb(kind === 'video' ? 50 : 5);
	const prefix = mimePrefix ?? `${kind}/`;
	const shouldCompress = kind === 'video' ? false : (compress ?? true);

	const resolveSlug = (): string | undefined => (typeof slug === 'function' ? slug() : slug);

	const upload = async (file: File): Promise<string | null> => {
		if (!file.type.startsWith(prefix)) {
			error = `Only ${prefix}* allowed.`;
			return null;
		}
		pending += 1;
		error = '';
		try {
			const payload =
				shouldCompress && file.type.startsWith('image/')
					? await compressImage(file, typeof compress === 'object' ? compress : undefined)
					: file;
			if (payload.size > limit) {
				error = `File too large. Max ${formatBytes(limit)}.`;
				return null;
			}
			return await uploadPublicFile(bucket, payload, {
				slug: resolveSlug(),
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
