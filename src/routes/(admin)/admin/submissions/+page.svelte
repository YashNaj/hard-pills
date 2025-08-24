<script lang="ts">
	import SubmissionsTable from '../../components/submissions-table.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { 
		Inbox, 
		Clock, 
		CheckCircle, 
		XCircle,
		ArrowRight,
		Search,
		Mail
	} from 'lucide-svelte';
	
	let { data } = $props();
	
	let searchQuery = $state('');
	let statusFilter = $state('all');
	let filteredSubmissions = $derived(() => {
		let submissions = data.submissions || [];
		
		// Filter by search query
		if (searchQuery.trim()) {
			submissions = submissions.filter(submission => 
				(submission.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(submission.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(submission.subject?.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(submission.content?.toLowerCase().includes(searchQuery.toLowerCase()))
			);
		}
		
		// Filter by status
		if (statusFilter !== 'all') {
			submissions = submissions.filter(submission => submission.status === statusFilter);
		}
		
		return submissions;
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Submissions</h1>
			<p class="text-muted-foreground">Manage user-submitted content</p>
		</div>
		<Button href="/submit" target="_blank" variant="outline">
			<Mail class="mr-2 h-4 w-4" />
			View Submit Form
		</Button>
	</div>
	
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-5 gap-4">
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Total</CardTitle>
				<Inbox class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{data.meta.total}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Pending</CardTitle>
				<Clock class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-yellow-600">{data.meta.pending}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Approved</CardTitle>
				<CheckCircle class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-green-600">{data.meta.approved}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Rejected</CardTitle>
				<XCircle class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-red-600">{data.meta.rejected}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Converted</CardTitle>
				<ArrowRight class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-blue-600">{data.meta.converted}</div>
			</CardContent>
		</Card>
	</div>
	
	<!-- Filters -->
	<Card>
		<CardHeader>
			<CardTitle class="text-lg">Filter Submissions</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="flex flex-col sm:flex-row gap-4">
				<div class="flex-1">
					<div class="relative">
						<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							bind:value={searchQuery}
							placeholder="Search by name, email, subject, or content..."
							class="pl-10"
						/>
					</div>
				</div>
				
				<div class="sm:w-48">
					<select
						bind:value={statusFilter}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="all">All Status</option>
						<option value="pending">Pending</option>
						<option value="approved">Approved</option>
						<option value="rejected">Rejected</option>
						<option value="converted">Converted</option>
					</select>
				</div>
			</div>
			
			{#if searchQuery || statusFilter !== 'all'}
				<div class="flex items-center gap-2">
					<span class="text-sm text-muted-foreground">
						Showing {filteredSubmissions.length} of {data.meta.total} submissions
					</span>
					{#if searchQuery}
						<Badge variant="secondary">
							Search: "{searchQuery}"
						</Badge>
					{/if}
					{#if statusFilter !== 'all'}
						<Badge variant="secondary">
							Status: {statusFilter}
						</Badge>
					{/if}
				</div>
			{/if}
		</CardContent>
	</Card>
	
	<!-- Submissions Table -->
	<Card>
		<CardHeader>
			<CardTitle>All Submissions</CardTitle>
		</CardHeader>
		<CardContent class="p-0">
			{#if filteredSubmissions.length === 0}
				<div class="p-8 text-center text-muted-foreground">
					{#if searchQuery || statusFilter !== 'all'}
						No submissions match your current filters.
					{:else}
						No submissions yet. Share your submission form to start receiving content!
					{/if}
				</div>
			{:else}
				<div class="overflow-auto">
					<SubmissionsTable submissions={filteredSubmissions} />
				</div>
			{/if}
		</CardContent>
	</Card>
</div>