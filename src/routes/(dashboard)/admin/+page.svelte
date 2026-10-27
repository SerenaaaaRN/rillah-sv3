<script lang="ts">
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import ArrowSquareOut from 'phosphor-svelte/lib/ArrowSquareOut';
	import Certificate from 'phosphor-svelte/lib/Certificate';
	import GitBranch from 'phosphor-svelte/lib/GitBranch';
	import PencilSimple from 'phosphor-svelte/lib/PencilSimple';
	import Plus from 'phosphor-svelte/lib/Plus';
	import Pulse from 'phosphor-svelte/lib/Pulse';
	import Tag from 'phosphor-svelte/lib/Tag';
	import TerminalWindow from 'phosphor-svelte/lib/TerminalWindow';
	import StatCard from '#lib/components/shared/stat-card.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Card } from '#lib/components/ui/card/index.js';
	import type { PageProps } from './$types.js';

	let { data }: PageProps = $props();

	let totalProjects = $derived(data.projectCount);
	let totalCertificates = $derived(data.certificateCount);

	let uniqueCategoryCount = $derived(
		new Set((data.recentProjects ?? []).map((p) => p.category).filter(Boolean)).size
	);

	let tagCounts = $derived.by(() => {
		const counts: Record<string, number> = {};
		for (const project of data.recentProjects ?? []) {
			for (const tag of project.tags ?? []) {
				const normalized = tag.trim().toLowerCase();
				if (!normalized) continue;
				counts[normalized] = (counts[normalized] ?? 0) + 1;
			}
		}
		return counts;
	});

	let uniqueTagsCount = $derived(Object.keys(tagCounts).length);

	let topTechnologies = $derived(
		Object.entries(tagCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([name, count]) => ({ name, count }))
	);

	let maxTechCount = $derived(
		topTechnologies.length > 0 ? Math.max(...topTechnologies.map((t) => t.count)) : 1
	);

	let recentProjects = $derived(data.recentProjects ?? []);
	let recentCertificates = $derived(data.recentCertificates ?? []);

	const stats = $derived([
		{
			title: 'Total Projects',
			value: totalProjects,
			icon: GitBranch,
			href: '/admin/projects'
		},
		{
			title: 'Certificates',
			value: totalCertificates,
			icon: Certificate,
			href: '/admin/certificates'
		},
		{
			title: 'Technologies',
			value: uniqueTagsCount,
			icon: TerminalWindow,
			href: undefined
		},
		{
			title: 'Categories',
			value: uniqueCategoryCount,
			icon: Tag,
			href: undefined
		}
	]);
</script>

<div class="flex flex-col gap-8 pb-10">
	<div>
		<h1 class="text-3xl font-bold tracking-tight text-foreground">System Overview</h1>
		<p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">
			Welcome back! Here is a summary of your portfolio activities, system content stats, and
			technology stacks.
		</p>
	</div>

	<!-- KPI Stats Cards -->
	<section
		aria-label="Overview statistics"
		class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
	>
		{#each stats as stat (stat.title)}
			<StatCard title={stat.title} value={stat.value} icon={stat.icon} href={stat.href} />
		{/each}
	</section>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
		<!-- Left Side: Tech Stack Statistics and Recent Projects -->
		<aside class="flex min-w-0 flex-col gap-8 lg:col-span-7">
			<!-- Tech Stack Distribution Card -->
			<Card class="flex flex-col gap-5 p-6">
				<div>
					<h3 class="leading-tight font-semibold">Top Technologies Used</h3>
					<p class="mt-1 text-xs leading-relaxed text-muted-foreground">
						Distribution of language and library tags across all published projects.
					</p>
				</div>

				{#if topTechnologies.length > 0}
					<div class="flex flex-col gap-4 pt-2">
						{#each topTechnologies as tech (tech.name)}
							{@const percentage = (tech.count / maxTechCount) * 100}
							<div class="flex flex-col gap-1.5">
								<div class="flex items-center justify-between text-sm">
									<span>{tech.name}</span>
									<span class="text-xs text-muted-foreground">
										{tech.count}
										{tech.count === 1 ? 'project' : 'projects'}
									</span>
								</div>
								<div class="h-2 w-full overflow-hidden rounded-none bg-muted">
									<div
										class="h-full rounded-none bg-linear-to-r from-primary to-primary/60 transition-all duration-500 ease-out"
										style="width: {percentage}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="py-4 text-center text-xs text-muted-foreground">
						Add projects with tags to see tech statistics.
					</p>
				{/if}
			</Card>

			<!-- Recent Projects Preview -->
			<div class="flex flex-col gap-6">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 class="text-xl leading-none font-bold tracking-tight md:text-2xl">
							Recent Projects
						</h2>
						<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
							Quick look at your latest portfolio items.
						</p>
					</div>
					<div class="flex shrink-0 items-center gap-2">
						<Button variant="outline" size="sm" href="/admin/projects/new">
							<Plus class="size-4" />New Project
						</Button>
						<Button size="sm" href="/admin/projects">View All<ArrowRight class="size-4" /></Button>
					</div>
				</div>

				<div class="flex w-full flex-col gap-4">
					{#each recentProjects as project (project.id || project.slug)}
						<Card class="group flex flex-row items-center justify-between gap-3 p-4">
							<div class="flex min-w-0 items-center gap-4">
								{#if project.image?.[0]}
									<div
										class="relative h-12 w-20 shrink-0 overflow-hidden rounded-none border border-border"
									>
										<img
											src={project.image[0]}
											alt={project.title}
											width="80"
											height="48"
											loading="lazy"
											decoding="async"
											class="h-full w-full object-cover"
										/>
									</div>
								{:else}
									<div
										class="flex h-12 w-20 shrink-0 items-center justify-center rounded-none border border-border"
									>
										<GitBranch class="size-5 text-muted-foreground" />
									</div>
								{/if}
								<div class="min-w-0">
									<h4 class="truncate text-sm leading-snug font-semibold">{project.title}</h4>
									<div class="mt-1.5 flex flex-wrap gap-1">
										{#each project.tags.slice(0, 3) as tag (tag)}
											<Badge variant="secondary" class="px-1.5 py-0.5 text-[10px] font-medium">
												{tag}
											</Badge>
										{/each}
									</div>
								</div>
							</div>

							<div class="flex items-center gap-2">
								{#if project.demo}
									<Button
										variant="ghost"
										size="icon"
										href={project.demo}
										target="_blank"
										rel="noopener noreferrer"
										title="Open Demo"
									>
										<ArrowSquareOut class="size-4" />
									</Button>
								{/if}
								<Button
									variant="ghost"
									size="icon"
									href={`/admin/projects/${project.id}`}
									title="Edit Project"
								>
									<PencilSimple class="size-4" />
								</Button>
							</div>
						</Card>
					{:else}
						<div
							class="rounded-none border border-dashed p-8 text-center text-sm text-muted-foreground"
						>
							No projects recorded yet.
						</div>
					{/each}
				</div>
			</div>
		</aside>

		<!-- Right Side: Recent Certificates -->
		<aside class="flex min-w-0 flex-col gap-8 lg:col-span-5">
			<div class="flex flex-col gap-6">
				<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 class="text-xl leading-none font-bold tracking-tight md:text-2xl">
							Recent Certificates
						</h2>
						<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
							Manage your professional badges.
						</p>
					</div>
					<div class="flex shrink-0 items-center gap-2">
						<Button variant="ghost" size="sm" href="/admin/certificates/new">
							<Plus class="size-4" />New Cert
						</Button>
						<Button size="sm" href="/admin/certificates">
							View All<ArrowRight class="size-4" />
						</Button>
					</div>
				</div>

				<div class="flex w-full flex-col gap-4">
					{#each recentCertificates as cert (cert.id)}
						<Card class="group flex flex-row items-center justify-between gap-3 p-4">
							<div class="flex min-w-0 items-center gap-4">
								{#if cert.image_url}
									<div
										class="relative h-12 w-16 shrink-0 overflow-hidden rounded-none border border-border"
									>
										<img
											src={cert.image_url}
											alt={cert.title}
											width="64"
											height="48"
											loading="lazy"
											decoding="async"
											class="h-full w-full object-cover"
										/>
									</div>
								{:else}
									<div
										class="flex h-12 w-16 shrink-0 items-center justify-center rounded-none border border-border bg-muted"
									>
										<Certificate class="size-5 text-muted-foreground" />
									</div>
								{/if}
								<div class="min-w-0">
									<h4 class="truncate text-sm leading-snug font-semibold">{cert.title}</h4>
									<p class="mt-1 truncate text-xs text-muted-foreground">
										{cert.issuer} &bull; {cert.date}
									</p>
								</div>
							</div>

							<Button
								variant="ghost"
								size="icon"
								href={`/admin/certificates/${cert.id}`}
								title="Edit Certificate"
							>
								<PencilSimple class="size-4" />
							</Button>
						</Card>
					{:else}
						<div
							class="rounded-none border border-dashed p-8 text-center text-sm text-muted-foreground"
						>
							No certificates uploaded yet.
						</div>
					{/each}
				</div>
			</div>

			<!-- Activity hint card -->
			<Card class="flex flex-row items-center gap-4 p-4">
				<div class="rounded-none bg-muted p-2 text-muted-foreground">
					<Pulse class="size-4.5" />
				</div>
				<div class="min-w-0">
					<p class="truncate text-sm font-semibold">Portfolio activity</p>
					<p class="mt-0.5 truncate text-xs text-muted-foreground">
						{totalProjects} projects &bull; {totalCertificates} certificates tracked
					</p>
				</div>
			</Card>
		</aside>
	</div>
</div>
