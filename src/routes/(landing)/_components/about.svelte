<script lang="ts">
	import ArrowSquareOut from 'phosphor-svelte/lib/ArrowSquareOut';
	import FileText from 'phosphor-svelte/lib/FileText';
	import BlurFade from '#lib/components/shared/blur-fade.svelte';
	import * as SectionHeading from '#lib/components/shared/section-heading/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
</script>

<BlurFade delay={0.25} inView>
	<div class="mt-10">
		<SectionHeading.Root>
			<SectionHeading.Eyebrow>About</SectionHeading.Eyebrow>
			<SectionHeading.Title
				>A little <SectionHeading.Accent>about me</SectionHeading.Accent></SectionHeading.Title
			>
			<SectionHeading.Description
				>I'm a third-semester Informatics student at Sriwijaya University, currently focused on
				applied Deep Learning, Natural Language and building scalable software architectures with
				Python. When I'm not fine-tuning models or wrangling data pipelines, you'll find me
				experimenting with new frameworks, writing about what I learn, or contributing to
				open-source projects.</SectionHeading.Description
			>
		</SectionHeading.Root>

		<div class="mt-6 flex flex-wrap gap-3">
			<Button href="#" target="_blank" size="sm">
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
