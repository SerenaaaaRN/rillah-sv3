export const parseJsonOrCsv = (val: unknown): string[] => {
	if (!val) return [];
	if (Array.isArray(val)) return val as string[];
	if (typeof val !== 'string') return [];
	const trimmed = val.trim();
	if (!trimmed) return [];
	if (trimmed.startsWith('[')) {
		try {
			const parsed = JSON.parse(trimmed);
			if (Array.isArray(parsed)) return parsed as string[];
		} catch {
			// fallback to csv
		}
	}
	return trimmed
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
};

export const asStringArray = (val: unknown): string[] => {
	if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string');
	return parseJsonOrCsv(val);
};
