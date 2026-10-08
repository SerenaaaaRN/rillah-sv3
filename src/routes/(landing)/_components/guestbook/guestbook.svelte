<script lang="ts">
	import { enhance } from '$app/forms';
	import BlurFade from '$lib/components/shared/blur-fade.svelte';
	import * as SectionHeading from '$lib/components/shared/section-heading';
	import type { GuestbookEntry } from '$lib/schema/guestbook.js';
	import { errorMessage } from '$lib/utils/error.js';
	import GuestbookForm from './guestbook-form.svelte';
	import MessageList from './message-list.svelte';

	interface Props {
		entries?: GuestbookEntry[];
	}

	let { entries = [] }: Props = $props();

	let name = $state('');
	let message = $state('');
	let isSubmitting = $state(false);
	let formError = $state<string | null>(null);
	let notice = $state<string | null>(null);
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
			<form
				method="POST"
				action="?/guestbook"
				use:enhance={() => {
					isSubmitting = true;
					formError = null;
					notice = null;

					return async ({ result, update }) => {
						isSubmitting = false;
						if (result.type === 'success') {
							name = '';
							message = '';
							notice = 'Comment posted!';
							await update();
						} else if (result.type === 'failure') {
							formError = errorMessage(result.data?.error, 'Failed to submit');
						}
					};
				}}
			>
				<GuestbookForm bind:name bind:message {isSubmitting} error={formError} {notice} />
			</form>
			<MessageList {entries} />
		</div>
	</section>
</BlurFade>
