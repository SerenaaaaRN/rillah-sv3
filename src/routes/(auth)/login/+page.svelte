<script lang="ts">
	import Eye from 'phosphor-svelte/lib/Eye';
	import EyeSlash from 'phosphor-svelte/lib/EyeClosed';
	import LockKey from 'phosphor-svelte/lib/LockKey';
	import SpinnerGap from 'phosphor-svelte/lib/SpinnerGap';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { ActionData } from './$types';

	let { form }: { form?: ActionData } = $props();

	let showPassword = $state(false);
	let isPending = $state(false);
</script>

<div class="grid min-h-svh lg:grid-cols-2">
	<div class="flex flex-col gap-4 p-6 md:p-10">
		<div class="flex justify-center gap-2 md:justify-start">
			<a href="/" class="flex items-center gap-2 font-medium">
				<div
					class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
				>
					<!-- Phosphor icon pengganti GalleryVerticalEnd -->
					<LockKey weight="bold" size={16} />
				</div>
				Rillah Inc.
			</a>
		</div>

		<div class="flex flex-1 items-center justify-center">
			<div class="w-full max-w-xs">
				<form
					method="POST"
					use:enhance={() => {
						isPending = true;
						return async ({ update }) => {
							isPending = false;
							await update();
						};
					}}
					class="flex flex-col gap-6"
				>
					{#if form?.status === 'error'}
						<div
							class="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
						>
							<div class="h-2 w-2 shrink-0 rounded-full bg-destructive"></div>
							{form.message}
						</div>
					{/if}

					<div class="flex flex-col gap-4">
						<div class="flex flex-col items-center gap-1 text-center">
							<h1 class="text-2xl font-bold">Login to your account</h1>
							<p class="text-sm text-balance text-muted-foreground">
								Enter your email below to login to your account
							</p>
						</div>

						<!-- Email -->
						<div class="grid gap-2">
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

						<!-- Password -->
						<div class="grid gap-2">
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

						<!-- Submit -->
						<Button type="submit" disabled={isPending}>
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
			</div>
		</div>
	</div>

	<div class="relative hidden bg-muted lg:block">
		<img
			src="/login.jpg"
			alt="Login background"
			class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
		/>
	</div>
</div>
