<script lang="ts">
	import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import CircleNotch from 'phosphor-svelte/lib/CircleNotch';
	import Plus from 'phosphor-svelte/lib/Plus';
	import Trash from 'phosphor-svelte/lib/Trash';
	import Upload from 'phosphor-svelte/lib/Upload';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { cn } from '$lib/utils.js';

	type ImageItem = {
		id: string;
		url: string;
		name: string;
		uploading?: boolean;
		error?: string;
	};

	let {
		currentImages = [],
		slug = 'temp',
		onUploadStateChange
	}: {
		currentImages?: string[];
		slug?: string;
		onUploadStateChange?: (v: boolean) => void;
	} = $props();

	let items: ImageItem[] = $state([]);

	$effect(() => {
		if (items.some((i) => i.uploading)) return;
		const seeded = currentImages.map((url, idx) => ({
			id: `existing-${idx}`,
			url,
			name: url.split('/').pop() ?? `image-${idx}`
		}));
		const currentUrls = items.map((i) => i.url).join('|');
		const seededUrls = seeded.map((i) => i.url).join('|');
		if (currentUrls !== seededUrls && items.every((i) => !i.id.startsWith('new-'))) {
			items = seeded;
		}
	});

	let isDragging = $state(false);
	let fileInput: HTMLInputElement | null = $state(null);

	let isAnyUploading = $derived(items.some((i) => i.uploading));
	$effect(() => {
		onUploadStateChange?.(isAnyUploading);
	});

	function updateItem(id: string, updates: Partial<ImageItem>) {
		items = items.map((item) => (item.id === id ? { ...item, ...updates } : item));
	}

	async function uploadFile(id: string, file: File) {
		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('slug', slug);
			const res = await fetch('?/uploadImage', { method: 'POST', body: formData });
			const json = await res.json();
			const data = json?.data ?? json;
			const publicUrl = data?.publicUrl ?? data?.data?.publicUrl ?? '';
			if (!publicUrl) throw new Error(data?.error ?? 'Upload failed');
			updateItem(id, { url: publicUrl, uploading: false });
		} catch {
			updateItem(id, { uploading: false, error: 'Upload failed' });
		}
	}

	function handleFiles(files: FileList | null) {
		if (!files) return;
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (!file.type.startsWith('image/')) continue;
			const tempId = `new-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
			const localUrl = URL.createObjectURL(file);
			const newItem: ImageItem = { id: tempId, url: localUrl, name: file.name, uploading: true };
			items = [...items, newItem];
			uploadFile(tempId, file);
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		handleFiles((e as DragEvent & { dataTransfer: DataTransfer }).dataTransfer.files);
	}

	function removeImage(id: string) {
		const item = items.find((i) => i.id === id);
		if (item?.url.startsWith('blob:')) URL.revokeObjectURL(item.url);
		items = items.filter((i) => i.id !== id);
	}

	function moveItem(index: number, dir: 'left' | 'right') {
		const target = dir === 'left' ? index - 1 : index + 1;
		if (target < 0 || target >= items.length) return;
		const updated = [...items];
		const [moved] = updated.splice(index, 1);
		updated.splice(target, 0, moved);
		items = updated;
	}

	let savedUrls: string[] = $derived(
		items.filter((i) => !i.uploading && !i.error).map((i) => i.url)
	);
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
		{#if items.length === 0}
			<button
				type="button"
				onclick={() => fileInput?.click()}
				class="flex w-full flex-col items-center justify-center py-10 text-center"
			>
				<div class="flex size-12 items-center justify-center rounded-none bg-muted">
					<Upload class="size-5 text-muted-foreground" />
				</div>
				<p class="mt-3 text-sm font-medium">Click or drag images to upload</p>
				<p class="mt-1 text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB (multiple)</p>
			</button>
		{:else}
			<div class="grid grid-cols-2 gap-3">
				{#each items as item, index (item.id)}
					<div
						class="group relative aspect-16/10 overflow-hidden rounded-none border border-border bg-background"
					>
						<img
							src={item.url}
							alt={item.name}
							class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
						{#if item.uploading}
							<div
								class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-background/70 p-2 backdrop-blur-xs"
							>
								<CircleNotch class="size-5 animate-spin text-primary" />
								<span class="font-mono text-[10px] font-medium tracking-wide">UPLOADING...</span>
								<Progress value={60} class="h-1 w-16" />
							</div>
						{/if}
						{#if item.error}
							<div
								class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-destructive/10 p-2 text-center backdrop-blur-xs"
							>
								<span class="text-[10px] font-semibold tracking-wider text-destructive uppercase"
									>{item.error}</span
								>
								<Button
									type="button"
									variant="destructive"
									size="sm"
									onclick={() => removeImage(item.id)}
									class="px-2 py-0.5 text-[9px]">Discard</Button
								>
							</div>
						{/if}
						{#if !item.uploading && !item.error}
							<div
								class="absolute inset-0 flex flex-col justify-between bg-foreground/60 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
							>
								<div class="flex items-center justify-between">
									<span
										class="max-w-[70%] truncate rounded-none bg-foreground/40 px-1.5 py-0.5 font-mono text-[10px] text-background/70 backdrop-blur-xs"
										>Saved</span
									>
									<Button
										type="button"
										variant="destructive"
										size="icon"
										onclick={() => removeImage(item.id)}
										class="size-6"
										title="Remove image"><Trash class="size-4" /></Button
									>
								</div>
								<div class="flex items-center justify-center gap-2">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										disabled={index === 0}
										onclick={() => moveItem(index, 'left')}
										class={cn(
											'size-8 bg-background/20 text-background backdrop-blur-xs hover:bg-background/30',
											index === 0 && 'cursor-not-allowed opacity-40'
										)}
										title="Move left"><ArrowLeft class="size-4" /></Button
									>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										disabled={index === items.length - 1}
										onclick={() => moveItem(index, 'right')}
										class={cn(
											'size-8 bg-background/20 text-background backdrop-blur-xs hover:bg-background/30',
											index === items.length - 1 && 'cursor-not-allowed opacity-40'
										)}
										title="Move right"><ArrowRight class="size-4" /></Button
									>
								</div>
							</div>
						{/if}
					</div>
				{/each}
				<button
					type="button"
					onclick={() => fileInput?.click()}
					class="flex aspect-16/10 flex-col items-center justify-center rounded-none border border-dashed border-border/80 bg-muted/20 transition-colors hover:border-foreground/40 hover:bg-muted/50"
				>
					<Plus class="mb-1 size-5 text-muted-foreground" />
					<span class="text-xs font-medium text-muted-foreground">Add Image</span>
				</button>
			</div>
		{/if}
	</div>
	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		multiple
		class="hidden"
		onchange={(e) => handleFiles((e.target as HTMLInputElement).files)}
	/>
	<input type="hidden" name="image" value={JSON.stringify(savedUrls)} />
</div>
