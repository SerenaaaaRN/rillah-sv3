<script lang="ts">
	import ChatText from 'phosphor-svelte/lib/ChatText';
	import PaperPlaneTilt from 'phosphor-svelte/lib/PaperPlaneTilt';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Card, CardContent, CardHeader, CardTitle } from '#lib/components/ui/card/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import Label from '#lib/components/ui/label/label.svelte';
	import { Textarea } from '#lib/components/ui/textarea/index.js';

	interface Props {
		name?: string;
		message?: string;
		isSubmitting?: boolean;
		error?: string | null;
		notice?: string | null;
	}

	let {
		name = $bindable(''),
		message = $bindable(''),
		isSubmitting = false,
		error = null,
		notice = null
	}: Props = $props();
</script>

<Card class="h-fit rounded-none">
	<CardHeader>
		<CardTitle class="flex items-center gap-2 font-display text-base">
			<ChatText class="size-4 text-primary" />
			Guestbook
		</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="space-y-4">
			<div class="space-y-2">
				<Label
					for="gb-name"
					class="font-mono text-[11px] font-medium tracking-[0.15em] text-muted-foreground uppercase"
				>
					Name
				</Label>
				<Input
					id="gb-name"
					name="name"
					bind:value={name}
					placeholder="Your name"
					maxlength={30}
					required
					disabled={isSubmitting}
					class="rounded-none bg-background/50"
				/>
			</div>
			<div class="space-y-2">
				<Label
					for="gb-message"
					class="font-mono text-[11px] font-medium tracking-[0.15em] text-muted-foreground uppercase"
				>
					Message
				</Label>
				<Textarea
					id="gb-message"
					name="message"
					bind:value={message}
					placeholder="Write something..."
					maxlength={300}
					required
					disabled={isSubmitting}
					class="min-h-28 resize-none rounded-none bg-background/50"
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
					class="border border-foreground/20 bg-muted px-3 py-2 text-xs text-foreground"
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
		</div>
	</CardContent>
</Card>
