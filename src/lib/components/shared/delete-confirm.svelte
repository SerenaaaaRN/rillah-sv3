<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import Trash from 'phosphor-svelte/lib/Trash';
	import * as AlertDialog from '#lib/components/ui/alert-dialog/index.js';
	import { Button } from '#lib/components/ui/button/index.js';

	let {
		id,
		invalidateTag,
		noun,
		title
	}: {
		id: string;
		invalidateTag: string;
		noun: string;
		title: string;
	} = $props();

	const deleteEnhance =
		() =>
		async ({ result, update }: { result: { type: string }; update: () => Promise<void> }) => {
			await update();
			if (result.type === 'success') await invalidate(invalidateTag);
		};
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="icon"
				class="size-8 rounded-none text-destructive hover:text-destructive"
				title="Delete"
			>
				<Trash class="size-4" />
			</Button>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content class="rounded-none">
		<AlertDialog.Header>
			<AlertDialog.Title>Delete {noun}?</AlertDialog.Title>
			<AlertDialog.Description
				>This will permanently delete "{title}". This action cannot be undone.</AlertDialog.Description
			>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel class="rounded-none">Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				class="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90"
			>
				{#snippet child({ props })}
					<form method="POST" action="?/delete" use:enhance={deleteEnhance}>
						<input type="hidden" name="id" value={id} />
						<button type="submit" {...props} class="w-full">Delete</button>
					</form>
				{/snippet}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
