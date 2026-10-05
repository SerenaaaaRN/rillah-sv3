<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { type Certificate } from '$lib/schema/certificate.js';
	import { UNSORTED_ORDER } from '$lib/supabase/types.js';
	import { toDateInputValue } from '$lib/utils/date.js';
	import { slugify } from '$lib/utils/slugify.js';
	import CertificateImageManager from './certificate-image-manager.svelte';

	let { certificate, mode = 'create' }: { certificate?: Certificate; mode: 'create' | 'edit' } =
		$props();

	let title = $state('');
	let seeded = $state(false);
	let isUploading = $state(false);
	let error = $state('');

	$effect.pre(() => {
		if (!seeded) {
			title = certificate?.title ?? '';
			seeded = true;
		}
	});

	let slug = $derived(slugify(title) || 'temp');

	function handleTitleInput(e: Event) {
		title = (e.target as HTMLInputElement).value;
	}
</script>

<div class="mx-auto flex max-w-5xl flex-col gap-8 py-4">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight">
				{mode === 'create' ? 'Create Certificate' : `Edit ${certificate?.title ?? ''}`}
			</h2>
			<p class="text-sm text-muted-foreground">
				{mode === 'create' ? 'Add a new certificate' : 'Update certificate details'}
			</p>
		</div>
		<Button variant="outline" href="/admin/certificates" class="rounded-none">Back</Button>
	</div>

	<form
		method="POST"
		action={mode === 'edit' ? '?/update' : '?/create'}
		use:enhance={() =>
			async ({ result, update }) => {
				if (result.type === 'failure')
					error = String((result.data as Record<string, unknown>)?.error ?? 'Failed');
				await update();
			}}
		class="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3"
	>
		{#if mode === 'edit' && certificate?.id}
			<input type="hidden" name="id" value={certificate.id} />
		{/if}

		<div class="flex flex-col gap-6 lg:col-span-2">
			<Card class="rounded-none">
				<CardHeader class="border-b border-border pb-3">
					<CardTitle class="text-base font-semibold">Certificate Information</CardTitle>
				</CardHeader>
				<CardContent class="flex flex-col gap-6 pt-6">
					<Field.Field>
						<Field.Label>Title *</Field.Label>
						<Input
							name="title"
							value={title}
							oninput={handleTitleInput}
							placeholder="AWS Certified Solutions Architect"
							required
							class="rounded-none"
						/>
					</Field.Field>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Field.Field>
							<Field.Label>Issuer</Field.Label>
							<Input
								name="issuer"
								value={certificate?.issuer ?? ''}
								placeholder="Amazon Web Services"
								class="rounded-none"
							/>
						</Field.Field>
						<Field.Field>
							<Field.Label>Date</Field.Label>
							<Input
								name="date"
								type="date"
								value={toDateInputValue(certificate?.date ?? '')}
								class="rounded-none"
							/>
							<Field.Description>Pick a date — stored as 15 September 2026.</Field.Description>
						</Field.Field>
					</div>
				</CardContent>
			</Card>
		</div>

		<aside class="flex flex-col gap-6">
			<Card class="rounded-none">
				<CardHeader class="border-b border-border pb-3"
					><CardTitle class="text-base font-semibold">Certificate Media</CardTitle></CardHeader
				>
				<CardContent class="pt-4">
					<Field.Field>
						<Field.Label>Certificate Image</Field.Label>
						<CertificateImageManager
							currentImage={certificate?.image_url ?? ''}
							{slug}
							onUploadStateChange={(v) => (isUploading = v)}
						/>
						<Field.Description>PNG, JPG up to 5MB — stored in certificate-images.</Field.Description
						>
					</Field.Field>
				</CardContent>
			</Card>

			<Card class="rounded-none">
				<CardHeader class="border-b border-border pb-3"
					><CardTitle class="text-base font-semibold">Settings</CardTitle></CardHeader
				>
				<CardContent class="pt-4">
					<Field.Field>
						<Field.Label>Display Order</Field.Label>
						<Input
							name="display_order"
							type="number"
							value={String(certificate?.display_order ?? UNSORTED_ORDER)}
							class="rounded-none"
						/>
					</Field.Field>
				</CardContent>
			</Card>
		</aside>

		<div class="flex items-center justify-between gap-4 lg:col-span-3">
			{#if error}<p class="text-sm text-destructive">{error}</p>{:else}<span></span>{/if}
			<div class="flex gap-2">
				<Button type="button" variant="outline" href="/admin/certificates" class="rounded-none"
					>Cancel</Button
				>
				<Button type="submit" disabled={isUploading} class="rounded-none"
					>{mode === 'create' ? 'Create Certificate' : 'Save Changes'}</Button
				>
			</div>
		</div>
	</form>
</div>
