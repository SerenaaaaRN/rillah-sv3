export function timeAgo(iso: string): string {
	try {
		const diff = Date.now() - new Date(iso).getTime();
		const s = Math.floor(diff / 1000);
		if (s < 60) return 'just now';
		const m = Math.floor(s / 60);
		if (m < 60) return `${m}m ago`;
		const h = Math.floor(m / 60);
		if (h < 24) return `${h}h ago`;
		const d = Math.floor(h / 24);
		if (d < 7) return `${d}d ago`;
		return new Date(iso).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	} catch {
		return String(iso);
	}
}

export const formatDate = (
	dateString?: string | null,
	options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
): string => {
	if (!dateString) return '';
	return new Date(dateString).toLocaleDateString('id-ID', options);
};

export const formatFullDate = (dateString?: string | null): string => {
	if (!dateString) return '';
	return new Date(dateString).toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
};
