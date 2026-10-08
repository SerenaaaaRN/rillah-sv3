export const mb = (n: number): number => n * 1024 * 1024;

export const formatBytes = (bytes: number): string => {
	if (bytes >= 1024 * 1024) return `${Math.round(bytes / 1024 / 1024)}MB`;
	if (bytes >= 1024) return `${Math.round(bytes / 1024)}KB`;
	return `${bytes}B`;
};
