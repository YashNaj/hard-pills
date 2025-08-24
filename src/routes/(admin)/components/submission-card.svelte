<script lang='ts'>
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { User, Mail, Calendar, MessageSquare, Edit, ExternalLink, Trash2 } from 'lucide-svelte';

	let { 
		submission,
		onDelete = null
	} = $props<{ 
		submission: any; 
		onDelete?: ((id: string) => void) | null;
	}>();

	let isCreatingResponse = $state(false);
	let isDeleting = $state(false);

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStatusVariant(status: string) {
		switch (status) {
			case 'pending': return 'outline';
			case 'reviewed': return 'secondary';
			case 'published': return 'default';
			case 'rejected': return 'destructive';
			default: return 'outline';
		}
	}

	function getUrgencyFromContent(content: string): 'high' | 'medium' | 'low' {
		const urgentWords = ['desperate', 'help', 'please', 'urgent', 'scared', 'dying', 'can\'t', 'emergency'];
		const highPriorityWords = ['depression', 'anxiety', 'panic', 'suicide', 'self-harm', 'abuse'];
		
		const lowerContent = content.toLowerCase();
		const urgentCount = urgentWords.filter(word => lowerContent.includes(word)).length;
		const highPriorityCount = highPriorityWords.filter(word => lowerContent.includes(word)).length;

		if (urgentCount >= 2 || highPriorityCount >= 1) return 'high';
		if (urgentCount >= 1) return 'medium';
		return 'low';
	}

	async function createResponsePost() {
		isCreatingResponse = true;
		
		try {
			const now = new Date();
			const timestamp = now.toLocaleString('en-US', {
				month: 'short',
				day: 'numeric', 
				year: 'numeric'
			});
			
			// Create a meaningful title based on the submission
			const title = submission.subject 
				? `Re: ${submission.subject}`
				: `Response to ${submission.name || 'Reader'} - ${timestamp}`;

			// Create initial content that references the submission
			const initialContent = `
				<p>Thank you for reaching out and sharing your experience with us. Your message is important, and I want to address your concerns thoughtfully.</p>
				
				<blockquote class="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4">
					<p><strong>Reader's Question:</strong></p>
					<p>"${submission.content.substring(0, 200)}${submission.content.length > 200 ? '...' : ''}"</p>
					<footer class="text-sm mt-2">— ${submission.name || 'Anonymous Reader'}</footer>
				</blockquote>

				<p>I understand how challenging this situation must be for you. Let me share some thoughts and strategies that might help...</p>

				<p><em>[Continue writing your response here...]</em></p>
			`;

			const response = await fetch('/api/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title,
					slug: `response-${submission.id.slice(0, 8)}-${Date.now()}`,
					content: initialContent,
					status: 'draft',
					featured: false,
					author: '22ae43cd-bfb8-426c-a3b0-5398be3dc93a',
					submissionId: submission.id
				})
			});
			
			if (response.ok) {
				const { post } = await response.json();
				goto(`/admin/editor/${post.id}`);
			} else {
				console.error('Failed to create response post');
			}
		} catch (error) {
			console.error('Error creating response post:', error);
		} finally {
			isCreatingResponse = false;
		}
	}

	function handleDeleteSubmit() {
		if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
			return false; // Prevent form submission
		}
		return true; // Allow form submission
	}

	// Get urgency level for styling
	const urgency = getUrgencyFromContent(submission.content || '');
	const urgencyStyles = {
		high: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20',
		medium: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20', 
		low: 'border-border bg-card'
	};
</script>

<Card class="hover:shadow-md transition-all duration-200 {urgencyStyles[urgency]} flex flex-col h-full">
	<CardHeader class="pb-2 flex-shrink-0">
		<!-- Header with title and badges -->
		<div class="flex items-start justify-between gap-3">
			<div class="flex-1 min-w-0">
				<CardTitle class="text-sm font-semibold line-clamp-2 flex items-start gap-2 leading-tight">
					<MessageSquare class="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
					<span>{submission.subject || 'No subject'}</span>
				</CardTitle>
			</div>
			<div class="flex flex-col gap-1 items-end flex-shrink-0">
				<Badge variant={getStatusVariant(submission.status || 'pending')} class="text-xs h-5">
					{(submission.status || 'pending').charAt(0).toUpperCase() + (submission.status || 'pending').slice(1)}
				</Badge>
				{#if urgency === 'high'}
					<Badge variant="destructive" class="text-xs h-5">
						Urgent
					</Badge>
				{:else if urgency === 'medium'}
					<Badge variant="secondary" class="text-xs h-5">
						Priority
					</Badge>
				{/if}
			</div>
		</div>
		
		<!-- Metadata row -->
		<div class="flex items-center gap-3 text-xs text-muted-foreground mt-2 flex-wrap">
			<div class="flex items-center gap-1 flex-shrink-0">
				<User class="w-3 h-3" />
				<span class="truncate max-w-20">{submission.name || 'Anonymous'}</span>
			</div>
			<div class="flex items-center gap-1 flex-shrink-0">
				<Calendar class="w-3 h-3" />
				<span>{submission.createdAt ? new Date(submission.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown'}</span>
			</div>
			{#if submission.email}
				<div class="flex items-center gap-1 flex-shrink-0">
					<Mail class="w-3 h-3" />
					<span class="truncate max-w-24 text-xs">{submission.email}</span>
				</div>
			{/if}
		</div>
	</CardHeader>
	
	<!-- Content area - grows to fill space -->
	<CardContent class="pt-0 pb-3 flex-1 flex flex-col">
		<div class="flex-1">
			<p class="text-xs leading-relaxed text-muted-foreground line-clamp-4">
				{submission.content || 'No content'}
			</p>
		</div>
	
		
		<!-- High priority warning -->
		{#if urgency === 'high'}
			<div class="mt-2 p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-300">
				⚠️ May require immediate attention
			</div>
		{/if}
		
		<!-- Action buttons - always at bottom -->
		<div class="flex gap-1.5 mt-3 pt-2 border-t border-border/50">
			<Button 
				size="sm" 
				onclick={createResponsePost}
				disabled={isCreatingResponse}
				class="flex-1 h-8 text-xs"
			>
				{#if isCreatingResponse}
					<div class="animate-spin rounded-full h-3 w-3 border-b border-current mr-1.5"></div>
					Creating...
				{:else}
					<Edit class="w-3 h-3 mr-1.5" />
					Respond
				{/if}
			</Button>
			
			{#if submission.email}
				<Button 
					variant="outline" 
					size="sm"
					onclick={() => window.open(`mailto:${submission.email}?subject=Re: ${submission.subject || 'Your submission'}`)}
					class="w-8 h-8 p-0"
					title="Send email"
				>
					<ExternalLink class="w-3 h-3" />
				</Button>
			{/if}
			
			{#if onDelete}
				<form 
					method="POST" 
					action="?/deleteSubmission"
					use:enhance={() => {
						if (!handleDeleteSubmit()) {
							return ({ cancel }) => cancel();
						}
						
						isDeleting = true;
						
						return async ({ result }) => {
							if (result.type === 'success') {
								onDelete?.(submission.id);
							}
							isDeleting = false;
						};
					}}
					class="inline"
				>
					<input type="hidden" name="submissionId" value={submission.id} />
					<Button 
						type="submit"
						variant="outline" 
						size="sm"
						disabled={isDeleting}
						class="w-8 h-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
						title="Delete submission"
					>
						{#if isDeleting}
							<div class="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
						{:else}
							<Trash2 class="w-3 h-3" />
						{/if}
					</Button>
				</form>
			{/if}
		</div>
	</CardContent>
</Card>
