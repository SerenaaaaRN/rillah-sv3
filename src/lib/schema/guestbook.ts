import { z } from 'zod';

export type GuestbookEntry = {
	id: string;
	name: string;
	message: string;
	created_at: string;
};

const FORBIDDEN_CONTENT = /<\s*(script|iframe)/i;

export const GuestbookSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(30, 'Name must be at most 30 characters'),
	message: z
		.string()
		.min(3, 'Message must be at least 3 characters')
		.max(300, 'Message must be at most 300 characters')
		.refine((msg) => !FORBIDDEN_CONTENT.test(msg), 'Invalid message content')
});

export type GuestbookInput = z.infer<typeof GuestbookSchema>;

export function validateGuestbook(input: unknown): { data?: GuestbookInput; error?: string } {
	const result = GuestbookSchema.safeParse(input);
	if (!result.success) {
		return { error: result.error.issues[0]?.message ?? 'Invalid input' };
	}
	return { data: result.data };
}
