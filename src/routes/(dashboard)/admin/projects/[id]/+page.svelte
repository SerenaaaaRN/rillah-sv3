<script lang="ts">
	import ProjectForm from '../_components/project-form.svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
</script>

<ProjectForm mode="edit" project={data.project} />
