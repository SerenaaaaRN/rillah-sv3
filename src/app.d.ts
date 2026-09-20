// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/types.js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session?: Session | null;
			user?: User | null;
		}
		// interface PageState {}
		interface Platform {
			env?: {
				GH_READ_USER_TOKEN_PERSONAL?: string;
				GITHUB_USERNAME?: string;
			};
			context: { waitUntil(promise: Promise<unknown>): void };
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
