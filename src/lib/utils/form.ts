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
