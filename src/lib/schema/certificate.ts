import { z } from 'zod';
import { UNSORTED_ORDER, type CertificatesRow } from '#lib/supabase/types.js';
import { formatDisplayDate } from '#lib/utils/date.js';

export type Certificate = {
	id: string;
	title: string;
	issuer: string;
	date: string;
	image_url: string;
	display_order: number;
	created_at: string;
};

export type CertificateFormState = {
	status: 'idle' | 'success' | 'error';
	message: string;
	errors?: Record<string, string[]>;
};

export const CertificateSchema = z.object({
	title: z.string().min(1, 'Title is required.').max(200),
	issuer: z.string().optional().default(''),
	date: z.string().optional().default(''),
	display_order: z.coerce.number().optional().default(UNSORTED_ORDER),
	image_url: z.string().optional().default('')
});

export type CertificateInput = z.infer<typeof CertificateSchema>;

export type Certification = {
	id: string;
	title: string;
	provider: string;
	issuedDisplay: string;
	image: string | null;
};

export function mapCertificateToCertification(cert: Certificate): Certification {
	return {
		id: cert.id,
		title: cert.title,
		provider: cert.issuer,
		issuedDisplay: cert.date,
		image: cert.image_url || null
	};
}

export function mapRowToCertificate(row: CertificatesRow): Certificate {
	return {
		id: row.id,
		title: row.title,
		issuer: row.issuer ?? '',
		date: row.date ?? '',
		image_url: row.image_url ?? '',
		display_order: row.display_order ?? UNSORTED_ORDER,
		created_at: row.created_at
	};
}

export function mapInputToRow(input: CertificateInput): Omit<CertificatesRow, 'id' | 'created_at'> {
	const displayDate = formatDisplayDate(input.date?.trim());
	return {
		title: input.title.trim(),
		issuer: input.issuer?.trim() ? input.issuer.trim() : null,
		date: displayDate ? displayDate : null,
		image_url: input.image_url?.trim() ? input.image_url.trim() : null,
		display_order: input.display_order ?? UNSORTED_ORDER
	};
}
