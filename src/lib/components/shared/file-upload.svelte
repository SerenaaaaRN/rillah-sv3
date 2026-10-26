<script lang="ts">
	import CircleNotch from 'phosphor-svelte/lib/CircleNotch';
	import Trash from 'phosphor-svelte/lib/Trash';
	import Upload from 'phosphor-svelte/lib/Upload';
	import VideoCamera from 'phosphor-svelte/lib/VideoCamera';
	import { Button } from '#lib/components/ui/button/index.js';
	import { uploadTask } from '#lib/hooks/upload-task.svelte.js';
	import { cn } from '#lib/utils.js';

	let {
		kind,
		bucket,
		currentUrl = '',
		slug = 'temp',
		hiddenName,
		accept,
		hint,
		onUploadStateChange
	}: {
		kind: 'image' | 'video';
		bucket: string;
		currentUrl?: string;
		slug?: string;
		hiddenName: string;
		accept: string;
		hint: string;
		onUploadStateChange?: (v: boolean) => void;
	} = $props();

	// Props never change during component lifetime (form remounts on navigation);
	// capturing the initial bucket/kind mirrors the project-form untrack pattern.
	// svelte-ignore state_referenced_locally
	const task = uploadTask({ bucket, slug: () => slug, kind });
	// svelte-ignore state_referenced_locally
	const isVideo = kind === 'video';

	let url = $state('');
	let isDragging = $state(false);
	let fileInput: HTMLInputElement | null = $state(null);
	let seeded = $state(false);

	$effect.pre(() => {
		// Seed once from server data; never re-seed so removing/uploading isn't clobbered.
		if (!seeded) {
			url = currentUrl ?? '';
			seeded = true;
		}
	});

	let hasFile = $derived(url.startsWith('/') || url.startsWith('http'));

	$effect(() => {
		onUploadStateChange?.(task.uploading);
	});

	const uploadFile = async (file: File) => {
		const uploaded = await task.upload(file);
		if (uploaded) url = uploaded;
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

	const removeFile = () => {
		url = '';
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
		{#if !hasFile}
			<button
				type="button"
				onclick={() => fileInput?.click()}
				class="flex w-full flex-col items-center justify-center py-10 text-center"
			>
				<div class="flex size-12 items-center justify-center rounded-none bg-muted">
					{#if isVideo}
						<VideoCamera class="size-5 text-muted-foreground" />
					{:else}
						<Upload class="size-5 text-muted-foreground" />
					{/if}
				</div>
				<p class="mt-3 text-sm font-medium">
					Click or drag {isVideo ? 'video' : 'image'} to upload
				</p>
				<p class="mt-1 text-xs text-muted-foreground">{hint}</p>
			</button>
		{:else}
			<div
				class="group relative aspect-16/10 overflow-hidden rounded-none border border-border {isVideo
					? 'bg-black'
					: 'bg-background'}"
			>
				{#if isVideo}
					<!-- svelte-ignore a11y_media_has_caption -->
					<video src={url} class="size-full object-cover" controls preload="none" playsinline
					></video>
				{:else}
					<img src={url} alt={hiddenName} class="size-full object-cover" />
				{/if}
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
							onclick={removeFile}
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
								onclick={removeFile}
								class="size-6"
								title="Remove {isVideo ? 'video' : 'image'}"><Trash class="size-4" /></Button
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
		{accept}
		class="hidden"
		onchange={(e) => handleFile((e.target as HTMLInputElement).files)}
	/>
	<input type="hidden" name={hiddenName} value={url} />
</div>
