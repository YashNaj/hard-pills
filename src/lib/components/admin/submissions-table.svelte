<script lang="ts">
	import { onMount } from 'svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { 
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Inbox, Eye, Check, X, ArrowRight, User } from 'lucide-svelte';
	
	let submissions = $state([]);
	let loading = $state(true);
	
	onMount(async () => {
		await loadSubmissions();
	});
	
	async function loadSubmissions() {
		try {
			const response = await fetch('/api/submissions');
			if (response.ok) {
				const data = await response.json();
				submissions = data.submissions || [];
			}
		} catch (error) {
			console.error('Failed to load submissions:', error);
		} finally {
			loading = false;
		}
	}
	
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
	
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
	
	function truncateContent(content: string, maxLength = 50) {
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
				await loadSubmissions(); // Refresh the list
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
					author: '22ae43cd-bfb8-426c-a3b0-5398be3dc93a' // Mock author for testing
				})
			});
			
			if (response.ok) {
				const { post } = await response.json();
				await updateSubmissionStatus(submission.id, 'converted');
				
				// Navigate to edit the new post
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
		// Simple modal or alert for now - can be enhanced later
		alert(`From: ${submission.name || 'Anonymous'}\nEmail: ${submission.email || 'No email'}\nSubject: ${submission.subject || 'No subject'}\n\nContent:\n${submission.content}`);
	}
</script>

<Card class="h-full">
	<CardHeader>
		<CardTitle class="flex items-center gap-2">
			<Inbox class="h-5 w-5" />
			Recent Submissions
		</CardTitle>
	</CardHeader>
	<CardContent class="p-0">
		{#if loading}
			<div class="p-6 text-center text-muted-foreground">
				Loading submissions...
			</div>
		{:else if submissions.length === 0}
			<div class="p-6 text-center text-muted-foreground">
				No submissions yet. Waiting for user contributions!
			</div>
		{:else}
			<div class="max-h-[600px] overflow-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>From</TableHead>
							<TableHead>Subject</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Date</TableHead>
							<TableHead class="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each submissions as submission (submission.id)}
							<TableRow>
								<TableCell class="font-medium">
									<div class="flex items-center gap-2">
										<User class="h-4 w-4 text-muted-foreground" />
										<div>
											<div class="font-medium">{submission.name || 'Anonymous'}</div>
											<div class="text-xs text-muted-foreground">{submission.email || 'No email'}</div>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div class="max-w-[200px]">
										<div class="font-medium">{submission.subject || 'No subject'}</div>
										<div class="text-xs text-muted-foreground">
											{truncateContent(submission.content)}
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Badge variant={getStatusVariant(submission.status)}>
										{submission.status || 'pending'}
									</Badge>
								</TableCell>
								<TableCell class="text-muted-foreground text-sm">
									{formatDate(submission.createdAt)}
								</TableCell>
								<TableCell class="text-right">
									<div class="flex items-center justify-end gap-1">
										<Button
											variant="ghost"
											size="sm"
											onclick={() => viewSubmission(submission)}
											class="h-8 w-8 p-0"
										>
											<Eye class="h-4 w-4" />
										</Button>
										
										{#if submission.status === 'pending'}
											<Button
												variant="ghost"
												size="sm"
												onclick={() => updateSubmissionStatus(submission.id, 'approved')}
												class="h-8 w-8 p-0 text-green-600 hover:text-green-700"
											>
												<Check class="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onclick={() => updateSubmissionStatus(submission.id, 'rejected')}
												class="h-8 w-8 p-0 text-red-600 hover:text-red-700"
											>
												<X class="h-4 w-4" />
											</Button>
										{/if}
										
										{#if submission.status === 'approved' || submission.status === 'pending'}
											<Button
												variant="ghost"
												size="sm"
												onclick={() => convertToPost(submission)}
												class="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
											>
												<ArrowRight class="h-4 w-4" />
											</Button>
										{/if}
									</div>
								</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		{/if}
	</CardContent>
</Card>