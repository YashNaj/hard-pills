<script lang='ts'>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Plus, Edit, FileText, MessageSquare, Calendar, User, Search, Clock, CheckCircle } from 'lucide-svelte';
	import SubmissionCard from '../../components/submission-card.svelte';

	let { data } = $props();
	
	// Load existing posts and submissions
	let posts = $state<any[]>([]);
	let submissions = $state<any[]>([]);
	let isLoading = $state(true);
	let searchTerm = $state('');
	let isCreatingPost = $state(false);
	
	const filteredPosts = $derived(
		posts?.filter(post => 
			post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.slug?.toLowerCase().includes(searchTerm.toLowerCase())
		) || []
	);
	
	const pendingSubmissions = $derived(
		submissions?.filter(sub => sub.status === 'pending' || sub.status === 'reviewed') || []
	);
	
	onMount(async () => {
		try {
			// Load posts and submissions
			console.log('Loading posts and submissions...');
			const [postsRes, submissionsRes] = await Promise.all([
				fetch('/api/posts'),
				fetch('/api/submissions')
			]);
			console.log('API responses:', { postsOk: postsRes.ok, submissionsOk: submissionsRes.ok });
			
			if (postsRes.ok) {
				const postsData = await postsRes.json();
				console.log('Posts response:', postsData);
				// API might return { posts: [...] } or just [...]
				posts = Array.isArray(postsData) ? postsData : 
						(Array.isArray(postsData.posts) ? postsData.posts : []);
				console.log('Posts array:', posts);
			} else {
				posts = [];
			}
			
			if (submissionsRes.ok) {
				const submissionsData = await submissionsRes.json();
				console.log('Submissions response:', submissionsData);
				// API returns { submissions: [...] }
				submissions = Array.isArray(submissionsData.submissions) ? submissionsData.submissions : [];
				console.log('Submissions array:', submissions);
			} else {
				submissions = [];
			}
		} catch (error) {
			console.error('Failed to load data:', error);
			posts = [];
			submissions = [];
		} finally {
			isLoading = false;
		}
	});

	async function createNewPost() {
		isCreatingPost = true;
		
		try {
			const now = new Date();
			const timestamp = now.toLocaleString('en-US', {
				month: 'short',
				day: 'numeric', 
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
			
			const response = await fetch('/api/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: `New Post - ${timestamp}`,
					slug: `new-post-${Date.now()}`,
					content: '<p>Start writing your post here...</p>',
					status: 'draft',
					featured: false,
					author: '22ae43cd-bfb8-426c-a3b0-5398be3dc93a'
				})
			});
			
			if (response.ok) {
				const { post } = await response.json();
				goto(`/admin/editor/${post.id}`);
			} else {
				console.error('Failed to create new post');
			}
		} catch (error) {
			console.error('Error creating new post:', error);
		} finally {
			isCreatingPost = false;
		}
	}
	
	function editPost(postId: string) {
		goto(`/admin/editor/${postId}`);
	}
	
	async function createPostFromSubmission(submissionId: string) {
		// Find the submission to use its subject as title
		const submission = submissions.find(s => s.id === submissionId);
		const now = new Date();
		const timestamp = now.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric', 
			year: 'numeric'
		});
		
		const title = submission?.subject ? 
			`Re: ${submission.subject}` : 
			`Response to Reader - ${timestamp}`;
		
		try {
			const response = await fetch('/api/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title,
					slug: `response-${Date.now()}`,
					content: '<p>Thank you for your message. Let me address your concerns...</p>',
					status: 'draft',
					featured: false,
					submissionId: submissionId
				})
			});
			
			if (response.ok) {
				const { post } = await response.json();
				goto(`/admin/editor/${post.id}`);
			} else {
				console.error('Failed to create post from submission');
			}
		} catch (error) {
			console.error('Error creating post from submission:', error);
		}
	}
	
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
	
	function getStatusBadgeVariant(status: string) {
		switch (status) {
			case 'published': return 'default';
			case 'scheduled': return 'secondary';
			case 'draft': return 'outline';
			default: return 'outline';
		}
	}
	
	function backToDashboard() {
		goto('/admin');
	}
</script>

<div class="min-h-screen bg-background px-6 py-3">
	<!-- Header -->
	<div class="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
		<div class="container flex h-16 items-center justify-between px-4">
			<div class="flex items-center gap-4">
				<Button variant="ghost" size="sm" onclick={backToDashboard} class="text-muted-foreground hover:text-foreground">
					← Back to Dashboard
				</Button>
				<div>
					<h1 class="text-lg font-semibold">Content Editor</h1>
					<p class="text-sm text-muted-foreground">Create new posts or edit existing content</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="container max-w-6xl mx-auto p-6 space-y-8">
		{#if isLoading}
			<div class="flex items-center justify-center py-16">
				<div class="text-center space-y-2">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
					<p class="text-sm text-muted-foreground">Loading content...</p>
				</div>
			</div>
		{:else}
			<!-- Create New Post Section -->
			<Card class="border-dashed border-2 hover:border-primary/50 transition-colors">
				<CardHeader class="text-center pb-2">
					<CardTitle class="flex items-center justify-center gap-2 text-lg">
						<Plus class="w-5 h-5" />
						Start Writing
					</CardTitle>
					<CardDescription>
						Create a new blog post or respond to a reader submission
					</CardDescription>
				</CardHeader>
				<CardContent class="pt-2">
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<Button onclick={createNewPost} size="lg" class="flex-1 sm:flex-none" disabled={isCreatingPost}>
							{#if isCreatingPost}
								<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
								Creating Post...
							{:else}
								<FileText class="w-4 h-4 mr-2" />
								New Blank Post
							{/if}
						</Button>
					</div>
				</CardContent>
			</Card>

			<!-- Pending Submissions Section -->
			{#if pendingSubmissions.length > 0}
				<div class="space-y-4">
					<div class="flex items-center gap-2">
						<MessageSquare class="w-5 h-5 text-primary" />
						<h2 class="text-xl font-semibold">Reader Submissions</h2>
						<Badge variant="secondary">{pendingSubmissions.length}</Badge>
					</div>
					<div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
						{#each pendingSubmissions as submission}
							<SubmissionCard 
								{submission} 
								onDelete={(id) => {
									// Remove from submissions array
									submissions = submissions.filter(s => s.id !== id);
								}}
							/>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Existing Posts Section -->
			<div class="space-y-4">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div class="flex items-center gap-2">
						<FileText class="w-5 h-5 text-primary" />
						<h2 class="text-xl font-semibold">Your Posts</h2>
						<Badge variant="outline">{posts.length}</Badge>
					</div>
					<div class="relative">
						<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input 
							placeholder="Search posts by title or slug..."
							bind:value={searchTerm}
							class="pl-10 w-full sm:w-72"
						/>
					</div>
				</div>

				{#if filteredPosts.length > 0}
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{#each filteredPosts as post}
							<Card class="hover:shadow-md transition-shadow">
								<CardHeader class="pb-3">
									<div class="flex items-start justify-between gap-2">
										<CardTitle class="text-base line-clamp-2">
											{post.title || 'Untitled Post'}
										</CardTitle>
										<Badge variant={getStatusBadgeVariant(post.status)}>
											{post.status || 'draft'}
										</Badge>
									</div>
									<CardDescription class="space-y-2">
										<p class="font-mono text-xs text-muted-foreground">/{post.slug || 'no-slug'}</p>
										<div class="flex items-center gap-4 text-xs text-muted-foreground">
											<div class="flex items-center gap-1">
												<Calendar class="w-3 h-3" />
												{post.createdAt ? formatDate(post.createdAt) : 'Unknown date'}
											</div>
											{#if post.featured}
												<div class="flex items-center gap-1 text-amber-600">
													<CheckCircle class="w-3 h-3" />
													Featured
												</div>
											{/if}
										</div>
									</CardDescription>
								</CardHeader>
								<CardContent class="pt-0">
									<Button 
										size="sm" 
										class="w-full" 
										onclick={() => post.id && editPost(post.id)}
									>
										<Edit class="w-4 h-4 mr-2" />
										Edit Post
									</Button>
								</CardContent>
							</Card>
						{/each}
					</div>
				{:else}
					<div class="text-center py-12 text-muted-foreground">
						{#if searchTerm}
							<p>No posts found matching "{searchTerm}"</p>
						{:else}
							<p>No posts created yet. Start by creating your first post!</p>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
