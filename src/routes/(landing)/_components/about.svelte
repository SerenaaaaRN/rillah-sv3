<script lang="ts">
	import ArrowSquareOut from 'phosphor-svelte/lib/ArrowSquareOut';
	import FileText from 'phosphor-svelte/lib/FileText';
	import BlurFade from '$lib/components/shared/blur-fade.svelte';
	import * as SectionHeading from '$lib/components/shared/section-heading';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<BlurFade delay={0.25} inView>
	<div class="mt-10">
		<SectionHeading.Root>
			<SectionHeading.Eyebrow>About</SectionHeading.Eyebrow>
			<SectionHeading.Title as="h1"
				>A little <SectionHeading.Accent>about me</SectionHeading.Accent></SectionHeading.Title
			>
			<SectionHeading.Description
				>I am is a first-year Informatics student at Sriwijaya University currently focused on
				building well-structured web applications with an emphasis on clean architecture and
				maintainable code organization.</SectionHeading.Description
			>
		</SectionHeading.Root>

		<div class="mt-6 flex flex-wrap gap-3">
			<Button href="blabla" target="_blank" size="sm">
				View Resume
				<ArrowSquareOut class="size-3" />
			</Button>
			<Button href="#" target="_blank" variant="outline" size="sm">
				View Portfolio PDF
				<FileText class="size-3" />
			</Button>
		</div>
	</div>
</BlurFade>
