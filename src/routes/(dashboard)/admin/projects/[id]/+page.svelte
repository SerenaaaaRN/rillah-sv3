<script lang="ts">
	import ProjectForm from '../_components/project-form.svelte';
	import type { PageProps } from './$types.js';

	let { data }: PageProps = $props();
</script>

<ProjectForm mode="edit" project={data.project} />
