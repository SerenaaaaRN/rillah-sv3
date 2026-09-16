export function timeAgo(iso: string): string {
	try {
		const diff = Date.now() - new Date(iso).getTime();
		const s = Math.floor(diff / 1000);
		if (s < 60) return 'baru saja';
		const m = Math.floor(s / 60);
		if (m < 60) return `${m} mnt lalu`;
		const h = Math.floor(m / 60);
		if (h < 24) return `${h} jam lalu`;
		const d = Math.floor(h / 24);
		if (d < 7) return `${d} hari lalu`;
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
	const parsed = new Date(dateString);
	if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleDateString('id-ID', options);
	const iso = parseDisplayDateToISO(dateString);
	if (iso) return new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', options);
	return dateString;
};

export const formatFullDate = (dateString?: string | null): string => {
	if (!dateString) return '';
	const parsed = new Date(dateString);
	if (!Number.isNaN(parsed.getTime())) {
		return parsed.toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
	const iso = parseDisplayDateToISO(dateString);
	if (iso) {
		return new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
	return dateString;
};

const MONTH_TO_INDEX: Record<string, number> = {
	januari: 1,
	februari: 2,
	maret: 3,
	april: 4,
	mei: 5,
	juni: 6,
	juli: 7,
	agustus: 8,
	september: 9,
	oktober: 10,
	november: 11,
	desember: 12
};

/**
 * Ubah tanggal tampilan "15 September 2026" atau ISO "2026-09-15"
 * menjadi ISO "YYYY-MM-DD". Mengembalikan '' bila tidak bisa dibaca.
 */
export function parseDisplayDateToISO(value?: string | null): string {
	const raw = String(value ?? '').trim();
	if (!raw) return '';
	const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (isoMatch) {
		const [, y, m, d] = isoMatch;
		const month = Number(m);
		const day = Number(d);
		if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
			return `${y}-${m}-${d}`;
		}
		return '';
	}
	const match = raw.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
	if (!match) return '';
	const [, dayStr, monthName, year] = match;
	const month = MONTH_TO_INDEX[monthName.toLowerCase()];
	const day = Number(dayStr);
	if (!month || day < 1 || day > 31) return '';
	return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Nilai untuk `<input type="date">` dari format simpan apa pun. */
export function toDateInputValue(value?: string | null): string {
	return parseDisplayDateToISO(value);
}

/**
 * Normalisasi masukan tanggal (ISO dari datepicker atau string tampilan lama)
 * ke format simpan "15 September 2026" (id-ID).
 * Mengembalikan '' bila kosong/tidak bisa dibaca.
 */
export function formatDisplayDate(value?: string | null): string {
	const iso = parseDisplayDateToISO(value);
	if (!iso) return '';
	return new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
}
