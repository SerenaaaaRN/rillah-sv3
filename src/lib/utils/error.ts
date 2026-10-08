export const errorMessage = (value: unknown, fallback = 'Upload failed'): string => {
	if (value instanceof Error) return value.message || fallback;
	if (typeof value === 'string' && value.trim() !== '') return value;
	return fallback;
};
