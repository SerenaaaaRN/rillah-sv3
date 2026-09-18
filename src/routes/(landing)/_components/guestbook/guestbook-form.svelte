<script lang="ts">
	import ChatText from 'phosphor-svelte/lib/ChatText';
	import PaperPlaneTilt from 'phosphor-svelte/lib/PaperPlaneTilt';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	let {
		name = $bindable(''),
		message = $bindable(''),
		isSubmitting = false,
		error = null,
		notice = null,
		onSubmit
	}: {
		name: string;
		message: string;
		isSubmitting: boolean;
		error: string | null;
		notice: string | null;
		onSubmit: (e: Event) => void;
	} = $props();
</script>

<Card class="h-fit rounded-none">
	<CardHeader class="pb-4">
		<CardTitle class="flex items-center gap-2 font-display text-base">
			<ChatText class="size-4 text-primary" />
			Guestbook
		</CardTitle>
		<CardDescription class="text-xs">Name is required</CardDescription>
	</CardHeader>
	<CardContent>
		<form onsubmit={onSubmit} class="space-y-4">
			<div class="space-y-2">
				<label
					for="gb-name"
					class="font-mono text-[11px] font-medium tracking-[0.15em] text-muted-foreground uppercase"
				>
					Name *
				</label>
				<Input
					id="gb-name"
					bind:value={name}
					placeholder="Your name"
					maxlength={30}
					required
					disabled={isSubmitting}
					class="rounded-none bg-background/50"
				/>
			</div>
			<div class="space-y-2">
				<label
					for="gb-message"
					class="font-mono text-[11px] font-medium tracking-[0.15em] text-muted-foreground uppercase"
				>
					Message *
				</label>
				<Textarea
					id="gb-message"
					bind:value={message}
					placeholder="Write something..."
					maxlength={300}
					required
					disabled={isSubmitting}
					class="min-h-27.5 resize-none rounded-none bg-background/50"
				/>
				<p class="text-right font-mono text-[11px] text-muted-foreground">{message.length}/300</p>
			</div>
			{#if error}
				<p
					role="alert"
					class="border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
				>
					{error}
				</p>
			{/if}
			{#if notice}
				<p
					role="status"
					class="border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400"
				>
					{notice}
				</p>
			{/if}
			<Button type="submit" disabled={isSubmitting} class="w-full gap-2 rounded-none">
				{#if isSubmitting}
					<span
						class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
					></span>
					Sending...
				{:else}
					<PaperPlaneTilt class="size-4" />
					Send
				{/if}
			</Button>
		</form>
	</CardContent>
</Card>
