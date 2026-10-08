export interface CompressImageOptions {
	maxDimension?: number;
	quality?: number;
}

const DEFAULT_MAX_DIMENSION = 1920;
const DEFAULT_QUALITY = 0.85;

const CONVERTIBLE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

/**
 * Convert a JPEG/PNG photo (or an oversized WebP) into a smaller WebP file
 * using the native Canvas API. Pure transform, no reactivity.
 */
export async function compressImage(file: File, opts: CompressImageOptions = {}): Promise<File> {
	if (typeof document === 'undefined' || !CONVERTIBLE_MIME.has(file.type)) return file;

	const { maxDimension = DEFAULT_MAX_DIMENSION, quality = DEFAULT_QUALITY } = opts;

	let bitmap: ImageBitmap;
	try {
		bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
	} catch {
		return file;
	}

	try {
		const longest = Math.max(bitmap.width, bitmap.height);
		if (file.type === 'image/webp' && longest <= maxDimension) return file;

		const scale = Math.min(1, maxDimension / longest);
		const width = Math.round(bitmap.width * scale);
		const height = Math.round(bitmap.height * scale);

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		if (!ctx) return file;
		ctx.drawImage(bitmap, 0, 0, width, height);

		const blob = await new Promise<Blob | null>((resolve) =>
			canvas.toBlob((b) => resolve(b), 'image/webp', quality)
		);
		if (!blob) return file;

		const name = file.name.includes('.')
			? `${file.name.slice(0, file.name.lastIndexOf('.'))}.webp`
			: `${file.name}.webp`;
		return new File([blob], name, { type: 'image/webp' });
	} finally {
		bitmap.close();
	}
}
