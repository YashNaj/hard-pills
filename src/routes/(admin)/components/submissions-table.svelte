<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { 
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Inbox, Eye, Check, X, ArrowRight, User, Mail, Calendar, FileText, MoreHorizontal, Filter, Search } from 'lucide-svelte';

	interface Props {
		submissions?: any[];
	}

	let { submissions = [] }: Props = $props();
	
	let selectedSubmission = $state(null);
	let showDetailDialog = $state(false);
	let searchTerm = $state('');
	let statusFilter = $state('all');
	
	// Track if filters have been touched
	let searchTouched = $state(false);
	let statusTouched = $state(false);
	
	
	// Filtered submissions based on search term and status - only when filters are touched
	let filteredSubmissions: any[] = $derived(() => {
		// Ensure submissions is an array and has data
		if (!Array.isArray(submissions) || submissions.length === 0) {
			return [];
		}
		
		let filtered = submissions;
		
		// Only apply search filter if search has been touched AND has content
		if (searchTouched && searchTerm && searchTerm.trim() !== '') {
			const search = searchTerm.toLowerCase();
			filtered = filtered.filter(submission => 
				(submission.name || '').toLowerCase().includes(search) ||
				(submission.email || '').toLowerCase().includes(search) ||
				(submission.subject || '').toLowerCase().includes(search) ||
				(submission.content || '').toLowerCase().includes(search)
			);
		}
		
		// Only apply status filter if status has been touched AND is not 'all'
		if (statusTouched && statusFilter && statusFilter !== 'all') {
			filtered = filtered.filter(submission => 
				(submission.status || 'pending') === statusFilter
			);
		}
		
		return filtered;
	});
	
	function getStatusVariant(status: string) {
		switch (status) {
			case 'pending':
				return 'outline';
			case 'approved':
				return 'default';
			case 'rejected':
				return 'destructive';
			case 'converted':
				return 'secondary';
			default:
				return 'outline';
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'pending':
				return 'text-yellow-600 bg-yellow-50 border-yellow-200';
			case 'approved':
				return 'text-green-600 bg-green-50 border-green-200';
			case 'rejected':
				return 'text-red-600 bg-red-50 border-red-200';
			case 'converted':
				return 'text-blue-600 bg-blue-50 border-blue-200';
			default:
				return 'text-gray-600 bg-gray-50 border-gray-200';
		}
	}
	
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatRelativeDate(dateString: string) {
		const date = new Date(dateString);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		
		if (days === 0) return 'Today';
		if (days === 1) return 'Yesterday';
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
		return formatDate(dateString);
	}
	
	function truncateContent(content: string, maxLength = 60) {
		return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
	}
	
	async function updateSubmissionStatus(submissionId: string, status: string) {
		try {
			const response = await fetch(`/api/submissions/${submissionId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status })
			});
			
			if (response.ok) {
				// Trigger a refresh by dispatching an event
				window.dispatchEvent(new CustomEvent('submissionUpdated'));
			} else {
				alert('Failed to update submission');
			}
		} catch (error) {
			console.error('Update error:', error);
			alert('Failed to update submission');
		}
	}
	
	async function convertToPost(submission: any) {
		try {
			const response = await fetch('/api/submissions/convert', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					submissionId: submission.id,
					title: submission.subject || 'Untitled Post',
					content: submission.content,
					author: '22ae43cd-bfb8-426c-a3b0-5398be3dc93a'
				})
			});
			
			if (response.ok) {
				const { post } = await response.json();
				await updateSubmissionStatus(submission.id, 'converted');
				window.location.href = `/admin?edit=${post.id}`;
			} else {
				alert('Failed to convert submission');
			}
		} catch (error) {
			console.error('Convert error:', error);
			alert('Failed to convert submission');
		}
	}
	
	function viewSubmission(submission: any) {
		selectedSubmission = submission;
		showDetailDialog = true;
	}
	
	console.log('SUBMISSIONS', {submissions,filteredSubmissions})
</script>

<!-- Modern Responsive Submissions Table -->
<div class="flex flex-col h-full">
	<!-- Filter Controls -->
	<div class="flex-none p-4 border-b bg-background">
		<div class="flex gap-4 items-center">
			<!-- Search Input -->
			<div class="flex-1 max-w-sm">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						bind:value={searchTerm}
						placeholder="Search submissions..."
						class="pl-10"
						oninput={() => searchTouched = true}
					/>
				</div>
			</div>
			
			<!-- Status Filter -->
			<div class="flex items-center gap-2">
				<Filter class="h-4 w-4 text-muted-foreground" />
				<select
					bind:value={statusFilter}
					class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					onchange={() => statusTouched = true}
				>
					<option value="all">All Status</option>
					<option value="pending">Pending</option>
					<option value="approved">Approved</option>
					<option value="rejected">Rejected</option>
					<option value="converted">Converted</option>
				</select>
			</div>
			
			<!-- Results Count -->
			<div class="text-sm text-muted-foreground">
				{#if searchTouched || statusTouched}
					{filteredSubmissions.length} of {submissions.length} submissions
				{:else}
					{submissions.length} submissions
				{/if}
			</div>
		</div>
	</div>


	<!-- Scrollable Content -->
	<div class="flex-1 overflow-auto min-h-0">
		<div class="divide-y divide-border">
			{#each submissions as submission (submission.id)}
					<div class="p-4 hover:bg-muted/5 transition-colors">
						<div class="flex items-center justify-between gap-4">
							<!-- Content -->
							<div class="flex-1 min-w-0">
								<h3 class="font-medium text-foreground truncate">
									{submission.subject || 'No subject'}
								</h3>
								<p class="text-sm text-muted-foreground">
									{submission.name || 'Anonymous'}
									{#if submission.email}
										• {submission.email}
									{/if}
								</p>
							</div>
							
							<!-- Status and Actions -->
							<div class="flex items-center gap-3 flex-shrink-0">
								<div class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border {getStatusColor(submission.status)}">
									{submission.status || 'pending'}
								</div>
								<div class="text-xs text-muted-foreground">
									{formatRelativeDate(submission.createdAt)}
								</div>
								<!-- Action Menu -->
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										{#snippet child({ props })}
											<Button {...props} variant="ghost" size="sm" class="h-8 w-8 p-0">
												<MoreHorizontal class="h-4 w-4" />
												<span class="sr-only">Open menu</span>
											</Button>
										{/snippet}
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end" class="w-48 bg-pink-50">
										<DropdownMenu.Item onclick={() => viewSubmission(submission)} class="flex items-center gap-2">
											<Eye class="h-4 w-4" />
											View Details
										</DropdownMenu.Item>
										
										{#if submission.status === 'pending'}
											<DropdownMenu.Separator />
											<DropdownMenu.Item 
												onclick={() => updateSubmissionStatus(submission.id, 'approved')} 
												class="flex items-center gap-2 text-green-600"
											>
												<Check class="h-4 w-4" />
												Approve
											</DropdownMenu.Item>
											<DropdownMenu.Item 
												onclick={() => updateSubmissionStatus(submission.id, 'rejected')} 
												class="flex items-center gap-2 text-red-600"
											>
												<X class="h-4 w-4" />
												Reject
											</DropdownMenu.Item>
										{/if}
										
										{#if submission.status === 'approved' || submission.status === 'pending'}
											<DropdownMenu.Separator />
											<DropdownMenu.Item 
												onclick={() => convertToPost(submission)} 
												class="flex items-center gap-2 text-blue-600"
											>
												<ArrowRight class="h-4 w-4" />
												Convert to Post
											</DropdownMenu.Item>
										{/if}
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						</div>
					</div>
			{/each}
		</div>
	</div>
</div>

<!-- Detail Dialog -->
<Dialog.Root bind:open={showDetailDialog}>
	<Dialog.Content class="max-w-2xl bg-pink-50 max-h-[80vh]">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<FileText class="h-5 w-5" />
				Submission Details
			</Dialog.Title>
		</Dialog.Header>
		
		{#if selectedSubmission}
			<div class="max-h-[60vh] overflow-auto pr-4">
				<div class="space-y-6">
					<!-- Submitter Info -->
					<div class="space-y-3">
						<h3 class="font-semibold text-foreground border-b pb-2">Submitter Information</h3>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<label class="text-sm font-medium text-muted-foreground">Name</label>
								<div class="mt-1 text-sm font-medium">{selectedSubmission.name || 'Anonymous'}</div>
							</div>
							<div>
								<label class="text-sm font-medium text-muted-foreground">Email</label>
								<div class="mt-1 text-sm">{selectedSubmission.email || 'Not provided'}</div>
							</div>
						</div>
						<div>
							<label class="text-sm font-medium text-muted-foreground">Submitted</label>
							<div class="mt-1 text-sm">{formatDate(selectedSubmission.createdAt)}</div>
						</div>
					</div>

					<!-- Content -->
					<div class="space-y-3">
						<h3 class="font-semibold text-foreground border-b pb-2">Content</h3>
						<div>
							<label class="text-sm font-medium text-muted-foreground">Subject</label>
							<div class="mt-1 text-sm font-medium">{selectedSubmission.subject || 'No subject'}</div>
						</div>
						<div>
							<label class="text-sm font-medium text-muted-foreground">Message</label>
							<div class="mt-1 text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap">
								{selectedSubmission.content}
							</div>
						</div>
					</div>

					<!-- Status & Actions -->
					<div class="flex items-center justify-between pt-4 border-t">
						<div class="flex items-center gap-3">
							<span class="text-sm font-medium text-muted-foreground">Status:</span>
							<div class="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium border {getStatusColor(selectedSubmission.status)}">
								{selectedSubmission.status || 'pending'}
							</div>
						</div>
						
						<div class="flex items-center gap-2">
							{#if selectedSubmission.status === 'pending'}
								<Button 
									size="sm" 
									variant="outline"
									onclick={() => updateSubmissionStatus(selectedSubmission.id, 'approved')}
									class="text-green-600 border-green-200 hover:bg-green-50"
								>
									<Check class="h-4 w-4 mr-1" />
									Approve
								</Button>
								<Button 
									size="sm" 
									variant="outline"
									onclick={() => updateSubmissionStatus(selectedSubmission.id, 'rejected')}
									class="text-red-600 border-red-200 hover:bg-red-50"
								>
									<X class="h-4 w-4 mr-1" />
									Reject
								</Button>
							{/if}
							
							{#if selectedSubmission.status === 'approved' || selectedSubmission.status === 'pending'}
								<Button 
									size="sm"
									onclick={() => convertToPost(selectedSubmission)}
									class="bg-blue-600 hover:bg-blue-700"
								>
									<ArrowRight class="h-4 w-4 mr-1" />
									Convert to Post
								</Button>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
