<script lang="ts">
	import BlurFade from '$lib/components/shared/blur-fade.svelte';
	import * as SectionHeading from '$lib/components/shared/section-heading';
	import { validateGuestbook, type GuestbookEntry } from '$lib/schema/guestbook.js';
	import GuestbookForm from './guestbook-form.svelte';
	import MessageList from './message-list.svelte';

	let { entries = [] }: { entries: GuestbookEntry[] } = $props();

	let name = $state('');
	let message = $state('');
	let isSubmitting = $state(false);
	let formError = $state<string | null>(null);
	let notice = $state<string | null>(null);
	let pending = $state<GuestbookEntry[]>([]);
	let confirmed = $state<GuestbookEntry[]>([]);

	let localEntries = $derived([...pending, ...confirmed, ...entries]);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		const { data, error: validationError } = validateGuestbook({
			name: name.trim(),
			message: message.trim()
		});
		if (!data) {
			formError = validationError ?? 'Invalid input';
			return;
		}
		formError = null;
		notice = null;
		isSubmitting = true;
		const optimistic: GuestbookEntry = {
			id: `optimistic-${Date.now()}`,
			name: data.name,
			message: data.message,
			created_at: new Date().toISOString()
		};
		pending = [optimistic, ...pending];
		try {
			const res = await fetch('/api/guestbook', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: data.name, message: data.message })
			});
			const payload = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(payload.error ?? 'Failed to send');
			notice = 'Comment posted!';
			name = '';
			message = '';
			pending = pending.filter((entry) => entry.id !== optimistic.id);
			confirmed = [
				{
					...optimistic,
					id: payload.id ?? optimistic.id,
					created_at: payload.created_at ?? optimistic.created_at
				},
				...confirmed
			];
		} catch (err) {
			pending = pending.filter((entry) => entry.id !== optimistic.id);
			formError = err instanceof Error ? err.message : 'Failed to send';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<BlurFade delay={0.25} inView>
	<section id="guestbook" class="mt-10 scroll-mt-20">
		<SectionHeading.Root class="mb-8">
			<SectionHeading.Eyebrow>Guestbook</SectionHeading.Eyebrow>
			<SectionHeading.Title>
				Leave a <SectionHeading.Accent>comment</SectionHeading.Accent>
			</SectionHeading.Title>
			<SectionHeading.Description>
				Share your thoughts — it appears instantly below.
			</SectionHeading.Description>
		</SectionHeading.Root>

		<div class="mx-auto grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2">
			<GuestbookForm
				bind:name
				bind:message
				{isSubmitting}
				error={formError}
				{notice}
				onSubmit={handleSubmit}
			/>
			<MessageList entries={localEntries} />
		</div>
	</section>
</BlurFade>
