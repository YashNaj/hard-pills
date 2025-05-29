<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Switch } from '$lib/components/ui/switch';
	import { 
		Settings as SettingsIcon,
		Globe,
		Mail,
		FileText,
		Shield,
		Save,
		RotateCcw
	} from 'lucide-svelte';
	
	let { data } = $props();
	
	// Create reactive copies of the settings
	let siteSettings = $state({ ...data.settings.site });
	let emailSettings = $state({ ...data.settings.email });
	let contentSettings = $state({ ...data.settings.content });
	let securitySettings = $state({ ...data.settings.security });
	
	let isSaving = $state(false);
	let saveMessage = $state('');
	
	async function saveSettings() {
		isSaving = true;
		saveMessage = '';
		
		try {
			// Implementation would save settings to database/config
			const allSettings = {
				site: siteSettings,
				email: emailSettings,
				content: contentSettings,
				security: securitySettings
			};
			
			console.log('Saving settings:', allSettings);
			
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			saveMessage = 'Settings saved successfully!';
			setTimeout(() => saveMessage = '', 3000);
		} catch (error) {
			console.error('Failed to save settings:', error);
			saveMessage = 'Failed to save settings. Please try again.';
		} finally {
			isSaving = false;
		}
	}
	
	function resetSettings() {
		if (!confirm('Are you sure you want to reset all settings to default values?')) return;
		
		siteSettings = { ...data.settings.site };
		emailSettings = { ...data.settings.email };
		contentSettings = { ...data.settings.content };
		securitySettings = { ...data.settings.security };
		
		saveMessage = 'Settings reset to default values.';
		setTimeout(() => saveMessage = '', 3000);
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Settings</h1>
			<p class="text-muted-foreground">Configure your blog settings and preferences</p>
		</div>
		<div class="flex gap-2">
			<Button variant="outline" onclick={resetSettings}>
				<RotateCcw class="mr-2 h-4 w-4" />
				Reset
			</Button>
			<Button onclick={saveSettings} disabled={isSaving}>
				<Save class="mr-2 h-4 w-4" />
				{isSaving ? 'Saving...' : 'Save Changes'}
			</Button>
		</div>
	</div>
	
	<!-- Save Message -->
	{#if saveMessage}
		<div class="p-4 rounded-lg {saveMessage.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}">
			{saveMessage}
		</div>
	{/if}
	
	<!-- Site Settings -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<Globe class="h-5 w-5" />
				Site Settings
			</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="site-title">Site Title</Label>
					<Input
						id="site-title"
						bind:value={siteSettings.title}
						placeholder="Your site title"
					/>
				</div>
				
				<div class="space-y-2">
					<Label for="site-url">Site URL</Label>
					<Input
						id="site-url"
						bind:value={siteSettings.url}
						placeholder="https://yoursite.com"
					/>
				</div>
			</div>
			
			<div class="space-y-2">
				<Label for="site-description">Site Description</Label>
				<Textarea
					id="site-description"
					bind:value={siteSettings.description}
					placeholder="Describe your blog..."
					rows={3}
				/>
			</div>
			
			<div class="space-y-2">
				<Label for="timezone">Timezone</Label>
				<select
					id="timezone"
					bind:value={siteSettings.timezone}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<option value="UTC">UTC</option>
					<option value="America/New_York">Eastern Time</option>
					<option value="America/Chicago">Central Time</option>
					<option value="America/Denver">Mountain Time</option>
					<option value="America/Los_Angeles">Pacific Time</option>
					<option value="Europe/London">London</option>
					<option value="Europe/Paris">Paris</option>
					<option value="Asia/Tokyo">Tokyo</option>
				</select>
			</div>
		</CardContent>
	</Card>
	
	<!-- Email Settings -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<Mail class="h-5 w-5" />
				Email Settings
			</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="from-name">From Name</Label>
					<Input
						id="from-name"
						bind:value={emailSettings.fromName}
						placeholder="Your Name"
					/>
				</div>
				
				<div class="space-y-2">
					<Label for="from-email">From Email</Label>
					<Input
						id="from-email"
						type="email"
						bind:value={emailSettings.fromEmail}
						placeholder="noreply@yoursite.com"
					/>
				</div>
			</div>
			
			<div class="space-y-2">
				<Label for="reply-to">Reply To Email</Label>
				<Input
					id="reply-to"
					type="email"
					bind:value={emailSettings.replyTo}
					placeholder="hello@yoursite.com"
				/>
			</div>
		</CardContent>
	</Card>
	
	<!-- Content Settings -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<FileText class="h-5 w-5" />
				Content Settings
			</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="posts-per-page">Posts Per Page</Label>
					<Input
						id="posts-per-page"
						type="number"
						bind:value={contentSettings.postsPerPage}
						min="1"
						max="50"
					/>
				</div>
				
				<div class="space-y-2">
					<Label for="excerpt-length">Excerpt Length (characters)</Label>
					<Input
						id="excerpt-length"
						type="number"
						bind:value={contentSettings.excerptLength}
						min="50"
						max="500"
					/>
				</div>
			</div>
			
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Enable Comments</Label>
						<p class="text-sm text-muted-foreground">Allow readers to comment on posts</p>
					</div>
					<Switch bind:checked={contentSettings.commentsEnabled} />
				</div>
				
				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Moderate Comments</Label>
						<p class="text-sm text-muted-foreground">Require approval before comments are published</p>
					</div>
					<Switch bind:checked={contentSettings.moderateComments} />
				</div>
			</div>
		</CardContent>
	</Card>
	
	<!-- Security Settings -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<Shield class="h-5 w-5" />
				Security Settings
			</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Require Authentication</Label>
						<p class="text-sm text-muted-foreground">Require login to access admin panel</p>
					</div>
					<Switch bind:checked={securitySettings.requireAuth} />
				</div>
				
				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Allow Registration</Label>
						<p class="text-sm text-muted-foreground">Allow new users to register accounts</p>
					</div>
					<Switch bind:checked={securitySettings.allowRegistration} />
				</div>
			</div>
			
			<div class="space-y-2">
				<Label for="session-timeout">Session Timeout (minutes)</Label>
				<Input
					id="session-timeout"
					type="number"
					bind:value={securitySettings.sessionTimeout}
					min="5"
					max="1440"
				/>
				<p class="text-sm text-muted-foreground">How long users stay logged in without activity</p>
			</div>
		</CardContent>
	</Card>
	
	<!-- Danger Zone -->
	<Card>
		<CardHeader>
			<CardTitle class="text-red-600">Danger Zone</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="p-4 border border-red-200 rounded-lg bg-red-50">
				<h4 class="font-semibold text-red-800 mb-2">Reset All Data</h4>
				<p class="text-sm text-red-700 mb-4">
					This will permanently delete all posts, submissions, and subscribers. This action cannot be undone.
				</p>
				<Button variant="destructive" onclick={() => alert('This would reset all data - confirmation required')}>
					Reset All Data
				</Button>
			</div>
			
			<div class="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
				<h4 class="font-semibold text-yellow-800 mb-2">Export Data</h4>
				<p class="text-sm text-yellow-700 mb-4">
					Download a backup of all your blog data including posts, submissions, and settings.
				</p>
				<Button variant="outline" onclick={() => alert('Export functionality would be implemented here')}>
					Export All Data
				</Button>
			</div>
		</CardContent>
	</Card>
</div>