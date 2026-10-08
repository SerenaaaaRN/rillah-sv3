import { uploadPublicFile } from '$lib/supabase/client.js';

export interface UploadTaskOptions {
	bucket: string;
	slug?: string | (() => string);
	folder?: string;
	maxBytes?: number;
	mimePrefix?: string;
}

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;

/**
 * Reactive single-concern upload task: pending counter, error string,
 * pre-validation, and the Supabase transport call.
 */
export const uploadTask = ({
	bucket,
	slug = 'temp',
	folder,
	maxBytes = DEFAULT_MAX_BYTES,
	mimePrefix
}: UploadTaskOptions) => {
	let pending = $state(0);
	let error = $state('');
	const uploading = $derived(pending > 0);

	const resolveSlug = (): string | undefined => (typeof slug === 'function' ? slug() : slug);

	const upload = async (file: File): Promise<string | null> => {
		if (mimePrefix && !file.type.startsWith(mimePrefix)) {
			error = `Only ${mimePrefix}* allowed.`;
			return null;
		}
		if (file.size > maxBytes) {
			error = `File too large. Max ${Math.round(maxBytes / 1024 / 1024)}MB.`;
			return null;
		}
		pending += 1;
		error = '';
		try {
			return await uploadPublicFile(bucket, file, {
				slug: resolveSlug(),
				folder,
				maxBytes
			});
		} catch (e) {
			error = e instanceof Error ? e.message : 'Upload failed';
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
