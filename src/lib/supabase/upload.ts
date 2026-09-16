import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types.js';

type TypedClient = SupabaseClient<Database>;

const sanitizeFileName = (name: string) =>
	name
		.toLowerCase()
		.replace(/[^a-z0-9.\-_]+/g, '-')
		.replace(/-+/g, '-')
		.slice(0, 100);

export async function uploadToBucket(
	supabase: TypedClient,
	bucket: string,
	slug: string,
	file: File,
	maxBytes: number,
	folder?: string
): Promise<string> {
	if (file.size > maxBytes) {
		throw new Error(`File too large. Max ${Math.round(maxBytes / 1024 / 1024)}MB.`);
	}
	const safeSlug = (slug || 'temp').toLowerCase().replace(/[^a-z0-9-_]+/g, '-');
	const prefix = (folder ?? '').replace(/^\/+|\/+$/g, '');
	const path = `${prefix ? prefix + '/' : ''}${safeSlug}/${Date.now()}-${sanitizeFileName(file.name)}`;

	const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
		contentType: file.type,
		upsert: false
	});
	if (uploadError) throw new Error(`[${bucket}] ${uploadError.message}`);

	const { data } = supabase.storage.from(bucket).getPublicUrl(path);
	if (!data?.publicUrl) throw new Error('Failed to get public URL.');
	return data.publicUrl;
}
