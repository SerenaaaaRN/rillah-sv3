import { fail } from '@sveltejs/kit';
import { z } from 'zod';

export type ParsedForm<S extends z.ZodType> =
	| { data: z.output<S>; errors: null }
	| { data: null; errors: Record<string, string[] | undefined> };

/** Parse a `formDataToRecord` output with a zod schema; `errors` is null when parsing succeeded. */
export function parseForm<S extends z.ZodType>(
	schema: S,
	record: Record<string, string>
): ParsedForm<S> {
	const parsed = schema.safeParse(record);
	return parsed.success
		? { data: parsed.data, errors: null }
		: { data: null, errors: parsed.error.flatten().fieldErrors };
}

/** Canonical 400 payload for admin form validation failures. */
export const validationFail = (errors: Record<string, string[] | undefined>) =>
	fail(400, { error: 'Validation failed.', errors });

/** Canonical 500 payload for admin DB failures. */
export const dbFail = (message: string) => fail(500, { error: message });

/** Canonical missing-id 400 payload for admin actions. */
export const missingIdFail = (noun: string) => fail(400, { error: `Missing ${noun} id.` });
