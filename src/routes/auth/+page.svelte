<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Phone, Shield } from 'lucide-svelte';

	let { data } = $props();

	let phoneNumber = $state('');
	let otpCode = $state('');
	let isLoading = $state(false);
	let step = $state<'phone' | 'otp'>('phone');
	let error = $state('');

	// Allowed phone number - this should match your phone number
	const ALLOWED_PHONE = '+19515883144';

	async function sendOTP() {
		if (phoneNumber !== ALLOWED_PHONE) {
			error = 'This phone number is not authorized for access.';
			return;
		}

		isLoading = true;
		error = '';

		try {
			const { data: authData, error: authError } = await data.supabase.auth.signInWithOtp({
				phone: phoneNumber,
				options: {
					shouldCreateUser: false // Don't create new users
				}
			});

			if (authError) {
				error = authError.message;
			} else {
				step = 'otp';
			}
		} catch (err) {
			error = 'Failed to send OTP. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	async function verifyOTP() {
		isLoading = true;
		error = '';

		try {
			const { data: authData, error: authError } = await data.supabase.auth.verifyOtp({
				phone: phoneNumber,
				token: otpCode,
				type: 'sms'
			});

			if (authError) {
				error = authError.message;
			} else {
				// Successfully authenticated
				goto('/admin');
			}
		} catch (err) {
			error = 'Invalid OTP code. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function handlePhoneSubmit(event: SubmitEvent) {
		event.preventDefault();
		sendOTP();
	}

	function handleOTPSubmit(event: SubmitEvent) {
		event.preventDefault();
		verifyOTP();
	}
</script>

<svelte:head>
	<title>Admin Login - Hard Pills</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-background p-4">
	<Card class="w-full max-w-md">
		<CardHeader class="text-center">
			<div class="flex justify-center mb-4">
				<Shield class="h-12 w-12 text-primary" />
			</div>
			<CardTitle class="text-2xl font-bold">Admin Access</CardTitle>
			<CardDescription>
				{#if step === 'phone'}
					Enter your phone number to receive a verification code
				{:else}
					Enter the 6-digit code sent to your phone
				{/if}
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if step === 'phone'}
				<form onsubmit={handlePhoneSubmit} class="space-y-4">
					<div class="space-y-2">
						<Label for="phone">Phone Number</Label>
						<div class="relative">
							<Phone class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								id="phone"
								type="tel"
								placeholder="+1 (555) 123-4567"
								bind:value={phoneNumber}
								class="pl-10"
								required
							/>
						</div>
					</div>
					
					{#if error}
						<div class="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
							{error}
						</div>
					{/if}

					<Button type="submit" class="w-full" disabled={isLoading || !phoneNumber.trim()}>
						{isLoading ? 'Sending...' : 'Send Verification Code'}
					</Button>
				</form>
			{:else}
				<form onsubmit={handleOTPSubmit} class="space-y-4">
					<div class="space-y-2">
						<Label for="otp">Verification Code</Label>
						<Input
							id="otp"
							type="text"
							placeholder="123456"
							bind:value={otpCode}
							maxlength="6"
							class="text-center text-lg tracking-widest"
							required
						/>
						<div class="text-xs text-muted-foreground text-center">
							Code sent to {phoneNumber}
						</div>
					</div>

					{#if error}
						<div class="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
							{error}
						</div>
					{/if}

					<div class="space-y-2">
						<Button type="submit" class="w-full" disabled={isLoading || otpCode.length !== 6}>
							{isLoading ? 'Verifying...' : 'Verify Code'}
						</Button>
						
						<Button 
							type="button" 
							variant="ghost" 
							class="w-full" 
							onclick={() => { step = 'phone'; otpCode = ''; error = ''; }}
						>
							← Back to Phone Number
						</Button>
					</div>
				</form>
			{/if}
		</CardContent>
	</Card>
</div>