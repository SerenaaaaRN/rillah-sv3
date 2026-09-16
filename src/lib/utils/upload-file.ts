import { deserialize } from '$app/forms';

type ActionUploadResult = {
	type: string;
	data?: { publicUrl?: unknown; error?: unknown };
	error?: { message?: unknown };
};

/**
 * POST a file to a named SvelteKit form action (`?/uploadImage`, ...)
 * and resolve with the returned public URL.
 * Uses `deserialize()` per Svelte docs — `res.json()` is not enough
 * for action responses. Throws with the server's message on failure.
 */
export async function uploadFileViaAction(
	actionUrl: string,
	file: File,
	slug: string
): Promise<string> {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('slug', slug);

	const res = await fetch(actionUrl, { method: 'POST', body: formData });
	const result = deserialize(await res.text()) as ActionUploadResult;

	if (result.type === 'success') {
		const publicUrl = String(result.data?.publicUrl ?? '');
		if (!publicUrl) throw new Error('Upload failed');
		return publicUrl;
	}
	if (result.type === 'failure') throw new Error(String(result.data?.error ?? 'Upload failed'));
	if (result.type === 'error') throw new Error(String(result.error?.message ?? 'Upload failed'));
	throw new Error('Upload failed');
}
