type FormDataPayload = Record<string, FormDataEntryValue | FormDataEntryValue[]>;

export function formDataToPayload(formData: FormData): FormDataPayload {	const payload: FormDataPayload = {};
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
