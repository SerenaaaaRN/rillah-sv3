import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { formatBytes, mb } from '$lib/utils/bytes.js';
import type { Database } from './types.js';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserClient(fetchFn?: typeof fetch) {
	if (fetchFn) {
		return createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
			global: { fetch: fetchFn }
		});
	}

	if (!browserClient) {
		if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
			throw new Error('Supabase environment variables are missing.');
		}
		browserClient = createBrowserClient<Database>(
			PUBLIC_SUPABASE_URL,
			PUBLIC_SUPABASE_PUBLISHABLE_KEY
		);
	}

	return browserClient;
}

export const createSupabaseBrowserClient = getBrowserClient;

function sanitizeSegment(value: string | undefined, fallback: string): string {
	const sanitized = (value?.trim() || fallback)
		.toLowerCase()
		.replace(/[^a-z0-9.\-_]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 100);

	return sanitized || fallback;
}

function buildStoragePath(
	folder: string | undefined,
	slug: string | undefined,
	filename: string
): string {
	const safeSlug = sanitizeSegment(slug, 'temp');
	const safeName = sanitizeSegment(filename, 'file');
	const prefix = folder?.replace(/^\/+|\/+$/g, '') || '';
	const basePath = prefix ? `${prefix}/${safeSlug}` : safeSlug;

	return `${basePath}/${Date.now()}-${safeName}`;
}

export interface UploadPublicFileOptions {
	slug?: string;
	folder?: string;
	maxBytes?: number;
	contentType?: string;
}

export async function uploadPublicFile(
	bucket: string,
	file: File,
	opts: UploadPublicFileOptions = {}
): Promise<string> {
	const maxBytes = opts.maxBytes ?? mb(5);
	if (file.size > maxBytes) {
		throw new Error(`File "${file.name}" terlalu besar. Maksimal ${formatBytes(maxBytes)}.`);
	}

	const supabase = getBrowserClient();
	const path = buildStoragePath(opts.folder, opts.slug, file.name);
	const contentType = opts.contentType || file.type || 'application/octet-stream';

	const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
		contentType,
		upsert: false
	});

	if (uploadError) {
		console.error(`[Supabase Upload] Bucket: ${bucket}, Path: ${path}`, uploadError);
		throw new Error(`Gagal mengupload file: ${uploadError.message}`);
	}

	const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
	if (!urlData?.publicUrl) {
		throw new Error('Gagal mendapatkan public URL setelah upload berhasil.');
	}

	return urlData.publicUrl;
}
