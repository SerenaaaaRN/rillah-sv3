import { json } from '@sveltejs/kit';
import { validateGuestbook } from '$lib/schema/guestbook.js';
import { createStaticClient } from '$lib/supabase/static.js';
import type { RequestHandler } from './$types';

const supabase = createStaticClient();

const rateMap = new Map<string, number>();
const RATE_LIMIT_MS = 30_000;
const RATE_MAP_MAX_SIZE = 500;

function getClientIp(request: Request): string {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
		request.headers.get('x-real-ip') ??
		'unknown'
	);
}

function pruneRateMap(now: number): void {
	if (rateMap.size <= RATE_MAP_MAX_SIZE) return;
	for (const [ip, timestamp] of rateMap) {
		if (now - timestamp > RATE_LIMIT_MS) rateMap.delete(ip);
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const ip = getClientIp(request);
	const now = Date.now();
	const last = rateMap.get(ip);
	if (last && now - last < RATE_LIMIT_MS) {
		const wait = Math.ceil((RATE_LIMIT_MS - (now - last)) / 1000);
		return json({ error: `Please wait ${wait}s before sending another message` }, { status: 429 });
	}

	let body: { name?: unknown; message?: unknown };
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const name = String(body.name ?? '').trim();
	const message = String(body.message ?? '').trim();

	const { data, error: validationError } = validateGuestbook({ name, message });
	if (!data) {
		return json({ error: validationError ?? 'Invalid input' }, { status: 400 });
	}

	try {
		const { data: row, error } = await supabase
			.from('reviews')
			.insert({ name: data.name, message: data.message })
			.select()
			.single();
		if (error) throw error;
		pruneRateMap(now);
		rateMap.set(ip, now);
		return json(
			{ id: String(row.id), name: row.name, message: row.message, created_at: row.created_at },
			{ status: 201 }
		);
	} catch (e) {
		console.warn('[supabase] reviews insert failed:', e instanceof Error ? e.message : String(e));
		return json({ error: 'Failed to save message' }, { status: 500 });
	}
};
