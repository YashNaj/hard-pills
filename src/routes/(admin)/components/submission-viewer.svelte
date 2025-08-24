<script lang='ts'>
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { User, Mail, Calendar, MessageSquare, ExternalLink } from 'lucide-svelte';

	let { submission } = $props<{ submission: any }>();

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
</script>

<Card class="h-fit">
	<CardHeader>
		<div class="flex items-start justify-between gap-2">
			<CardTitle class="text-base flex items-center gap-2">
				<MessageSquare class="w-4 h-4 text-primary" />
				Related Submission
			</CardTitle>
			<Badge variant={getStatusVariant(submission.status)}>
				{submission.status}
			</Badge>
		</div>
		<CardDescription>
			This post is responding to a reader submission
		</CardDescription>
	</CardHeader>
	<CardContent class="space-y-4">
		<!-- Submission Details -->
		<div class="space-y-3">
			<div class="text-sm font-medium">{submission.subject}</div>
			
			<div class="space-y-2 text-sm text-muted-foreground">
				<div class="flex items-center gap-2">
					<User class="w-3 h-3" />
					<span>{submission.name}</span>
				</div>
				<div class="flex items-center gap-2">
					<Mail class="w-3 h-3" />
					<span>{submission.email}</span>
				</div>
				<div class="flex items-center gap-2">
					<Calendar class="w-3 h-3" />
					<span>{formatDate(submission.createdAt)}</span>
				</div>
			</div>
		</div>

		<!-- Submission Content -->
		<div class="space-y-2">
			<div class="text-sm font-medium">Reader's Message:</div>
			<div class="text-sm bg-muted/50 p-3 rounded-lg border-l-2 border-primary/30">
				{submission.content}
			</div>
		</div>

		<!-- Context Note -->
		<div class="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded border-l-2 border-blue-200 dark:border-blue-800">
			<strong>Note:</strong> Use this submission as context for your post. Consider addressing the reader's concerns and providing helpful insights based on their request.
		</div>
	</CardContent>
</Card>