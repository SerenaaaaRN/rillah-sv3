<script lang="ts">
	import { enhance } from '$app/forms';
	import Eye from 'phosphor-svelte/lib/Eye';
	import EyeSlash from 'phosphor-svelte/lib/EyeClosed';
	import LockKey from 'phosphor-svelte/lib/LockKey';
	import SpinnerGap from 'phosphor-svelte/lib/SpinnerGap';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { ActionData } from './$types';

	let { data, form }: { data: { redirectTo: string }; form?: ActionData } = $props();

	let showPassword = $state(false);
	let isPending = $state(false);
</script>

<main class="grid min-h-svh lg:grid-cols-2">
	<div class="flex flex-col justify-between gap-8 p-6 md:p-10">
		<a href="/" class="flex items-center gap-2 font-medium">
			<span
				class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
			>
				<LockKey weight="bold" size={16} />
			</span>
			Rillah Inc.
		</a>

		<form
			method="POST"
			use:enhance={() => {
				isPending = true;
				return async ({ update }) => {
					isPending = false;
					await update();
				};
			}}
			class="mx-auto w-full max-w-xs space-y-6"
		>
			<input type="hidden" name="redirectTo" value={data.redirectTo} />
			{#if form?.status === 'error'}
				<div
					role="alert"
					class="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
				>
					<span class="size-2 shrink-0 rounded-full bg-destructive"></span>
					{form.message}
				</div>
			{/if}

			<header class="text-center">
				<h1 class="text-2xl font-bold">Login to your account</h1>
				<p class="mt-1 text-sm text-balance text-muted-foreground">
					Enter your email below to login to your account
				</p>
			</header>

			<div class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						required
						autocomplete="email"
						placeholder="m@example.com"
						disabled={isPending}
						value={form?.email ?? ''}
					/>
				</div>

				<div class="space-y-2">
					<Label for="password">Password</Label>
					<div class="relative">
						<Input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							required
							autocomplete="current-password"
							disabled={isPending}
							class="pr-10"
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
							tabindex="-1"
							aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
						>
							{#if showPassword}
								<EyeSlash size={16} />
							{:else}
								<Eye size={16} />
							{/if}
						</button>
					</div>
				</div>

				<Button type="submit" disabled={isPending} class="w-full">
					{#if isPending}
						<SpinnerGap size={16} class="animate-spin" />
						Memproses...
					{:else}
						<LockKey size={16} />
						Masuk
					{/if}
				</Button>
			</div>
		</form>

		<div aria-hidden="true"></div>
	</div>

	<figure class="relative m-0 hidden bg-muted lg:block">
		<img
			src="/login.jpg"
			alt="Login background"
			class="absolute inset-0 size-full object-cover dark:brightness-[0.2] dark:grayscale"
		/>
	</figure>
</main>
