type FormDataPayload = Record<string, FormDataEntryValue | FormDataEntryValue[]>;

export function formDataToPayload(formData: FormData): FormDataPayload {
	const payload: FormDataPayload = {};
	formData.forEach((value, key) => {
		if (Object.hasOwn(payload, key)) {
			if (Array.isArray(payload[key])) {
				(payload[key] as FormDataEntryValue[]).push(value);
			} else {
				payload[key] = [payload[key] as FormDataEntryValue, value];
			}
		} else {
			payload[key] = value;
		}
	});
	return payload;
}

/** String-only fields of a FormData, for zod parsing. Files are skipped. */
export function formDataToRecord(form: FormData): Record<string, string> {
	const out: Record<string, string> = {};
	form.forEach((value, key) => {
		if (typeof value === 'string') out[key] = value;
	});
	return out;
}
/**
 * Merubah link github menjadi thumbnail
 */
export const getGithubThumbnailUrl = (input: string): string | null => {
	if (!input) return null;

	const path = input
		.trim()
		.replace(/^https?:\/\/github\.com\//i, '')
		.replace(/\.git$/i, '')
		.replace(/\/+$/, '');
	const parts = path.split('/');

	if (parts.length < 2 || !parts[0] || !parts[1]) return null;

	return `https://opengraph.githubassets.com/1/${parts[0]}/${parts[1]}`;
};
