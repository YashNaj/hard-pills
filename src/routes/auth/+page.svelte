<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Lock, Shield, Mail } from 'lucide-svelte';

	let { data, form } = $props();

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
</script>

<svelte:head>
	<title>Admin Login - Hard Pills</title>
</svelte:head>

<div class="min-h-screen min-w-screen flex font-inter items-center justify-center bg-background p-4">
	<Card class="w-full max-w-md">
		<CardHeader class="text-center sticky">
			<div class="flex justify-center mb-4">
				<Shield class="h-12 w-12 text-primary" />
			</div>
			<CardTitle class="text-2xl font-bold">Admin Access</CardTitle>
			<CardDescription>
				Enter your email and password to access the admin panel
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<form method="POST" action="?/login" use:enhance={() => {
				isLoading = true;
				return async ({ result, update }) => {
					isLoading = false;
					await update();
				};
			}} class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<div class="relative">
						<Mail class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="admin@example.com"
							bind:value={email}
							class="pl-10"
							required
						/>
					</div>
				</div>
				
				<div class="space-y-2">
					<Label for="password">Password</Label>
					<div class="relative">
						<Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="Enter password"
							bind:value={password}
							class="pl-10"
							required
						/>
					</div>
				</div>
				
				{#if form?.error}
					<div class="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
						{form.error}
					</div>
				{/if}

				<Button type="submit" class="w-full" disabled={isLoading || !email.trim() || !password.trim()}>
					{isLoading ? 'Signing in...' : 'Sign In'}
				</Button>
			</form>
		</CardContent>
	</Card>
</div>
