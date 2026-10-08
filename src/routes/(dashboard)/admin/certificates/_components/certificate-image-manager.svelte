<script lang="ts">
	import CircleNotch from 'phosphor-svelte/lib/CircleNotch';
	import Trash from 'phosphor-svelte/lib/Trash';
	import Upload from 'phosphor-svelte/lib/Upload';
	import { Button } from '$lib/components/ui/button/index.js';
	import { uploadTask } from '$lib/hooks/upload-task.svelte.js';
	import { CERTIFICATE_IMAGE_BUCKET } from '$lib/supabase/types.js';
	import { cn } from '$lib/utils.js';

	let {
		currentImage = '',
		slug = 'temp',
		onUploadStateChange
	}: {
		currentImage?: string;
		slug?: string;
		onUploadStateChange?: (v: boolean) => void;
	} = $props();

	const task = uploadTask({
		bucket: CERTIFICATE_IMAGE_BUCKET,
		slug: () => slug
	});

	let imageUrl = $state('');
	let isDragging = $state(false);
	let fileInput: HTMLInputElement | null = $state(null);
	let seeded = $state(false);

	$effect.pre(() => {
		// Seed once from server data; never re-seed so removing/uploading isn't clobbered.
		if (!seeded) {
			imageUrl = currentImage ?? '';
			seeded = true;
		}
	});

	let hasImage = $derived(imageUrl.startsWith('/') || imageUrl.startsWith('http'));

	$effect(() => {
		onUploadStateChange?.(task.uploading);
	});

	const uploadFile = async (file: File) => {
		const url = await task.upload(file);
		if (url) imageUrl = url;
	};

	const handleFile = (files: FileList | null) => {
		if (!files || files.length === 0) return;
		uploadFile(files[0]);
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		isDragging = false;
		handleFile((e as DragEvent & { dataTransfer: DataTransfer }).dataTransfer.files);
	};

	const removeImage = () => {
		imageUrl = '';
		task.reset();
	};
</script>

<div class="flex flex-col gap-4">
	<div
		ondragover={(e) => {
			e.preventDefault();
			isDragging = true;
		}}
		ondragleave={() => (isDragging = false)}
		ondrop={handleDrop}
		class={cn(
			'relative min-h-40 rounded-none border border-dashed p-4 transition-all',
			isDragging
				? 'border-primary bg-primary/5'
				: 'border-border bg-muted/40 hover:border-foreground/30'
		)}
		role="region"
	>
		{#if !hasImage}
			<button
				type="button"
				onclick={() => fileInput?.click()}
				class="flex w-full flex-col items-center justify-center py-10 text-center"
			>
				<div class="flex size-12 items-center justify-center rounded-none bg-muted">
					<Upload class="size-5 text-muted-foreground" />
				</div>
				<p class="mt-3 text-sm font-medium">Click or drag image to upload</p>
				<p class="mt-1 text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
			</button>
		{:else}
			<div
				class="group relative aspect-16/10 overflow-hidden rounded-none border border-border bg-background"
			>
				<img src={imageUrl} alt="Certificate" class="size-full object-cover" />
				{#if task.uploading}
					<div
						class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-background/70 backdrop-blur-xs"
					>
						<CircleNotch class="size-5 animate-spin text-primary" />
						<span class="font-mono text-[10px] font-medium tracking-wide">UPLOADING...</span>
					</div>
				{/if}
				{#if task.error}
					<div
						class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-destructive/10 p-2 text-center backdrop-blur-xs"
					>
						<span class="text-[10px] font-semibold tracking-wider text-destructive uppercase"
							>{task.error}</span
						>
						<Button
							type="button"
							variant="destructive"
							size="sm"
							onclick={removeImage}
							class="px-2 py-0.5 text-[9px]">Discard</Button
						>
					</div>
				{/if}
				{#if !task.uploading && !task.error}
					<div
						class="absolute inset-0 flex flex-col justify-between bg-foreground/60 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
					>
						<div class="flex justify-end">
							<Button
								type="button"
								variant="destructive"
								size="icon"
								onclick={removeImage}
								class="size-6"
								title="Remove image"><Trash class="size-4" /></Button
							>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		class="hidden"
		onchange={(e) => handleFile((e.target as HTMLInputElement).files)}
	/>
	<input type="hidden" name="image_url" value={imageUrl} />
</div>
