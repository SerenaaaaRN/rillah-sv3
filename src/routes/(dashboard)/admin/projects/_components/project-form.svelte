<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import type { Project } from '$lib/schema/projects.js';
	import { slugify } from '$lib/utils/slugify.js';
	import ProjectImagesManager from './project-images-manager.svelte';
	import ProjectVideoManager from './project-video-manager.svelte';

	let { project, mode = 'create' }: { project?: Project; mode: 'create' | 'edit' } = $props();

	let title = $state('');
	let slug = $state('');
	let slugLocked = $state(false);
	let seeded = $state(false);
	let isUploading = $state(false);
	let error = $state('');

	$effect.pre(() => {
		if (!seeded) {
			title = project?.title ?? '';
			slug = project?.slug ?? '';
			slugLocked = mode !== 'create';
			seeded = true;
		}
	});

	function handleTitleChange(e: Event) {
		title = (e.target as HTMLInputElement).value;
		if (!slugLocked) slug = slugify(title);
	}

	function handleSlugChange(e: Event) {
		slug = slugify((e.target as HTMLInputElement).value);
		slugLocked = true;
	}

	function toggleSlugMode() {
		slugLocked = !slugLocked;
		if (!slugLocked) slug = slugify(title);
	}
</script>

<div class="mx-auto flex max-w-6xl flex-col gap-8 py-4">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight">
				{mode === 'create' ? 'Create Project' : `Edit ${project?.title ?? ''}`}
			</h2>
			<p class="text-sm text-muted-foreground">
				{mode === 'create' ? 'Add a new portfolio project' : 'Update project details'}
			</p>
		</div>
		<Button variant="outline" href="/admin/projects" class="rounded-none">Back</Button>
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
		{#if mode === 'edit' && project?.id}
			<input type="hidden" name="id" value={project.id} />
		{/if}

		<div class="flex flex-col gap-6 lg:col-span-2">
			<Card class="rounded-none">
				<CardHeader class="border-b border-border pb-3">
					<CardTitle class="text-base font-semibold">Core Details</CardTitle>
				</CardHeader>
				<CardContent class="flex flex-col gap-6 pt-6">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Field.Field>
							<Field.Label>Title *</Field.Label>
							<Input
								name="title"
								value={title}
								oninput={handleTitleChange}
								placeholder="My Awesome Project"
								required
								class="rounded-none"
							/>
						</Field.Field>
						<Field.Field>
							<Field.Label class="flex items-center gap-2">
								Slug *
								{#if mode === 'create'}
									<button
										type="button"
										onclick={toggleSlugMode}
										class="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
										>{slugLocked ? 'manual' : 'auto'}</button
									>
								{/if}
							</Field.Label>
							<Input
								name="slug"
								bind:value={slug}
								oninput={handleSlugChange}
								placeholder="my-awesome-project"
								required
								class="rounded-none font-mono"
							/>
						</Field.Field>
					</div>
					<Field.Field>
						<Field.Label>Description *</Field.Label>
						<Textarea
							name="description"
							value={project?.description ?? ''}
							placeholder="Short description..."
							required
							rows={3}
							class="rounded-none"
						/>
					</Field.Field>
					<Field.Field>
						<Field.Label>Detailed Content</Field.Label>
						<Textarea
							name="content"
							value={project?.content ?? ''}
							placeholder="Full project description..."
							rows={5}
							class="rounded-none"
						/>
					</Field.Field>
				</CardContent>
			</Card>

			<Card class="rounded-none">
				<CardHeader class="border-b border-border pb-3">
					<CardTitle class="text-base font-semibold">Features & Taxonomy</CardTitle>
				</CardHeader>
				<CardContent class="flex flex-col gap-6 pt-6">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<Field.Field>
							<Field.Label>Tags</Field.Label>
							<Input
								name="tags"
								value={project?.tags?.join(', ') ?? ''}
								placeholder="ReactJS, TailwindCSS, Python"
								class="rounded-none"
							/>
							<Field.Description>Separate with commas</Field.Description>
						</Field.Field>
						<Field.Field>
							<Field.Label>Featured</Field.Label>
							<Input
								name="featured"
								value={project?.featured?.join(', ') ?? ''}
								placeholder="Website, Mobile App"
								class="rounded-none"
							/>
							<Field.Description>Separate with commas</Field.Description>
						</Field.Field>
					</div>
					<Field.Field>
						<Field.Label>Key Features</Field.Label>
						<Textarea
							name="features"
							value={project?.features?.join(', ') ?? ''}
							placeholder="Step-by-step solutions, Interactive UI"
							rows={3}
							class="rounded-none"
						/>
						<Field.Description>Separate with commas</Field.Description>
					</Field.Field>
				</CardContent>
			</Card>
		</div>

		<!-- ui: media + settings -->
		<aside class="flex flex-col gap-6">
			<Card class="rounded-none">
				<CardHeader class="border-b border-border pb-3"
					><CardTitle class="text-base font-semibold">Project Video</CardTitle></CardHeader
				>
				<CardContent class="pt-4">
					<ProjectVideoManager
						currentVideo={project?.video ?? ''}
						{slug}
						onUploadStateChange={(v) => (isUploading = v)}
					/>
				</CardContent>
			</Card>
			<Card class="rounded-none">
				<CardHeader class="border-b border-border pb-3"
					><CardTitle class="text-base font-semibold">Project Images</CardTitle></CardHeader
				>
				<CardContent class="pt-4">
					<ProjectImagesManager
						currentImages={project?.image ?? []}
						{slug}
						onUploadStateChange={(v) => (isUploading = v)}
					/>
				</CardContent>
			</Card>
			<Card class="rounded-none">
				<CardHeader class="border-b border-border pb-3"
					><CardTitle class="text-base font-semibold">External Resources</CardTitle></CardHeader
				>
				<CardContent class="flex flex-col gap-6 pt-6">
					<Field.Field>
						<Field.Label>GitHub URL</Field.Label>
						<Input
							name="github"
							type="url"
							value={project?.github ?? ''}
							placeholder="https://github.com/..."
							class="rounded-none"
						/>
						<Field.Description
							>Jika tanpa upload foto, thumbnail GitHub dipakai otomatis.</Field.Description
						>
					</Field.Field>
					<Field.Field>
						<Field.Label>Demo URL</Field.Label>
						<Input
							name="demo"
							type="url"
							value={project?.demo ?? ''}
							placeholder="https://..."
							class="rounded-none"
						/>
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
							value={String(project?.display_order ?? 99)}
							class="rounded-none"
						/>
					</Field.Field>
				</CardContent>
			</Card>
		</aside>

		<div class="flex items-center justify-between gap-4 lg:col-span-3">
			{#if error}<p class="text-sm text-destructive">{error}</p>{:else}<span></span>{/if}
			<div class="flex gap-2">
				<Button type="button" variant="outline" href="/admin/projects" class="rounded-none"
					>Cancel</Button
				>
				<Button type="submit" disabled={isUploading} class="rounded-none"
					>{mode === 'create' ? 'Create Project' : 'Save Changes'}</Button
				>
			</div>
		</div>
	</form>
</div>
