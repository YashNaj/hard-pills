<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { 
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { 
		Mail, 
		Users, 
		TrendingUp, 
		Calendar,
		Search,
		Download,
		Send,
		UserPlus,
		Trash2
	} from 'lucide-svelte';
	
	let { data } = $props();
	
	let searchQuery = $state('');
	let selectedSubscribers = $state(new Set());
	let showNewsletter = $state(false);
	let newsletterSubject = $state('');
	let newsletterContent = $state('');
	
	let filteredSubscribers = $derived(() => {
		let subscribers = data.subscribers || [];
		
		if (searchQuery.trim()) {
			subscribers = subscribers.filter(subscriber => 
				subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
		
		return subscribers;
	});
	
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
	
	function toggleSubscriberSelection(subscriberId: string) {
		if (selectedSubscribers.has(subscriberId)) {
			selectedSubscribers.delete(subscriberId);
		} else {
			selectedSubscribers.add(subscriberId);
		}
		selectedSubscribers = new Set(selectedSubscribers);
	}
	
	function selectAllSubscribers() {
		selectedSubscribers = new Set(filteredSubscribers.map(s => s.id));
	}
	
	function clearSelection() {
		selectedSubscribers = new Set();
	}
	
	async function exportSubscribers() {
		try {
			const emails = filteredSubscribers.map(s => s.email).join('\n');
			const blob = new Blob([emails], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'subscribers.txt';
			a.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Export failed:', error);
		}
	}
	
	async function sendNewsletter() {
		if (!newsletterSubject || !newsletterContent) {
			alert('Please fill in subject and content');
			return;
		}
		
		try {
			// Implementation would send newsletter
			console.log('Sending newsletter to:', selectedSubscribers.size || filteredSubscribers.length, 'subscribers');
			alert('Newsletter functionality would be implemented here');
		} catch (error) {
			console.error('Failed to send newsletter:', error);
		}
	}
	
	async function deleteSelectedSubscribers() {
		if (selectedSubscribers.size === 0) return;
		
		if (!confirm(`Are you sure you want to delete ${selectedSubscribers.size} subscriber(s)?`)) return;
		
		try {
			// Implementation would delete subscribers
			console.log('Deleting subscribers:', Array.from(selectedSubscribers));
			alert('Delete functionality would be implemented here');
		} catch (error) {
			console.error('Failed to delete subscribers:', error);
		}
	}
</script>

<div class="space-y-6 p-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Mailing List</h1>
			<p class="text-muted-foreground">Manage your email subscribers and newsletters</p>
		</div>
		<div class="flex gap-2">
			<Button variant="outline" onclick={exportSubscribers}>
				<Download class="mr-2 h-4 w-4" />
				Export
			</Button>
			<Button onclick={() => showNewsletter = !showNewsletter}>
				<Send class="mr-2 h-4 w-4" />
				Newsletter
			</Button>
		</div>
	</div>
	
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Total Subscribers</CardTitle>
				<Users class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{data.stats.total_subscribers}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">This Month</CardTitle>
				<TrendingUp class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-green-600">+{data.stats.new_this_month}</div>
				<p class="text-xs text-muted-foreground">
					+{data.stats.new_this_week} this week
				</p>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Today</CardTitle>
				<Calendar class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-blue-600">+{data.stats.new_today}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Growth Rate</CardTitle>
				<TrendingUp class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{data.stats.total_subscribers > 0 ? Math.round((data.stats.new_this_month / data.stats.total_subscribers) * 100) : 0}%
				</div>
				<p class="text-xs text-muted-foreground">Monthly growth</p>
			</CardContent>
		</Card>
	</div>
	
	<!-- Newsletter Composer -->
	{#if showNewsletter}
		<Card>
			<CardHeader>
				<CardTitle>Send Newsletter</CardTitle>
				<p class="text-sm text-muted-foreground">
					Send to {selectedSubscribers.size > 0 ? selectedSubscribers.size : filteredSubscribers.length} subscribers
				</p>
			</CardHeader>
			<CardContent class="space-y-4">
				<div>
					<label for="subject" class="block text-sm font-medium mb-2">Subject</label>
					<Input
						id="subject"
						bind:value={newsletterSubject}
						placeholder="Newsletter subject..."
					/>
				</div>
				
				<div>
					<label for="content" class="block text-sm font-medium mb-2">Content</label>
					<Textarea
						id="content"
						bind:value={newsletterContent}
						placeholder="Write your newsletter content..."
						rows={8}
					/>
				</div>
				
				<div class="flex gap-2">
					<Button onclick={sendNewsletter}>
						<Send class="mr-2 h-4 w-4" />
						Send Newsletter
					</Button>
					<Button variant="outline" onclick={() => showNewsletter = false}>
						Cancel
					</Button>
				</div>
			</CardContent>
		</Card>
	{/if}
	
	<!-- Subscribers Table -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center justify-between">
				<span>Subscribers</span>
				{#if selectedSubscribers.size > 0}
					<div class="flex gap-2">
						<Button variant="outline" size="sm" onclick={clearSelection}>
							Clear ({selectedSubscribers.size})
						</Button>
						<Button variant="destructive" size="sm" onclick={deleteSelectedSubscribers}>
							<Trash2 class="mr-2 h-4 w-4" />
							Delete Selected
						</Button>
					</div>
				{/if}
			</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<!-- Search and Actions -->
			<div class="flex flex-col sm:flex-row gap-4">
				<div class="flex-1">
					<div class="relative">
						<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							bind:value={searchQuery}
							placeholder="Search by email address..."
							class="pl-10"
						/>
					</div>
				</div>
				
				{#if selectedSubscribers.size === 0}
					<Button variant="outline" size="sm" onclick={selectAllSubscribers}>
						Select All ({filteredSubscribers.length})
					</Button>
				{/if}
			</div>
			
			{#if searchQuery}
				<div class="flex items-center gap-2">
					<span class="text-sm text-muted-foreground">
						Showing {filteredSubscribers.length} of {data.subscribers.length} subscribers
					</span>
					<Badge variant="secondary">
						Search: "{searchQuery}"
					</Badge>
				</div>
			{/if}
			
			<!-- Table -->
			{#if filteredSubscribers.length === 0}
				<div class="text-center py-8 text-muted-foreground">
					{#if searchQuery}
						No subscribers match your search.
					{:else}
						No subscribers yet. Add a subscription form to your site!
					{/if}
				</div>
			{:else}
				<div class="border rounded-lg">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead class="w-12">
									<input
										type="checkbox"
										checked={selectedSubscribers.size === filteredSubscribers.length}
										onchange={selectedSubscribers.size === filteredSubscribers.length ? clearSelection : selectAllSubscribers}
										class="w-4 h-4 rounded border-gray-300"
									/>
								</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Subscribed</TableHead>
								<TableHead class="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each filteredSubscribers as subscriber (subscriber.id)}
								<TableRow>
									<TableCell>
										<input
											type="checkbox"
											checked={selectedSubscribers.has(subscriber.id)}
											onchange={() => toggleSubscriberSelection(subscriber.id)}
											class="w-4 h-4 rounded border-gray-300"
										/>
									</TableCell>
									<TableCell class="font-medium">
										{subscriber.email}
									</TableCell>
									<TableCell class="text-muted-foreground">
										{formatDate(subscriber.created_at)}
									</TableCell>
									<TableCell class="text-right">
										<Button
											variant="ghost"
											size="sm"
											onclick={() => deleteSelectedSubscribers()}
											class="h-8 w-8 p-0 text-destructive hover:text-destructive"
										>
											<Trash2 class="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				</div>
			{/if}
		</CardContent>
	</Card>
</div>
