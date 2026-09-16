<script lang="ts">
	import About from './_components/about.svelte';
	import Intro from './_components/intro.svelte';
	import Skills from './_components/skills.svelte';
</script>

<svelte:head>
	<title>Rillah | AI Engineer</title>
	<meta
		name="description"
		content="Rillah is a AI Engineer building production LLM systems — RAG, MCP, and cloud-native agents."
	/>
</svelte:head>

<main>
	<Intro />
	<About />
	<Skills />
</main>
