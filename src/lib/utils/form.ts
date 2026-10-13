/** String-only fields of a FormData, for zod parsing. Files are skipped. */
export function formDataToRecord(form: FormData): Record<string, string> {
	const out: Record<string, string> = {};
	form.forEach((value, key) => {
		if (typeof value === 'string') out[key] = value;
	});
	return out;
}
