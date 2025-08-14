<script lang='ts'>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import TipTap from '$lib/components/admin/tip-tap.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Calendar, ExternalLink, Trash2 } from 'lucide-svelte';

	let { data } = $props();

	// Post state - initialize from server data
	let title = $state(data.post?.title || '');
	let slug = $state(data.post?.slug || '');
	let content = $state(data.post?.content || '');
	let status = $state(data.post?.status || 'draft');
	let featured = $state(data.post?.featured || false);
	let scheduledAt = $state<string>(data.post?.scheduledAt || '');
	let postId = $state<string>(data.post?.id);
	let createdAt = $state(data.post?.createdAt);
	let updatedAt = $state(data.post?.updatedAt);
	
	// UI state
	let isSaving = $state(false);
	let saveError = $state<string | null>(null);
	let isPublishing = $state(false);
	let isDeleting = $state(false);

	// Mock user ID
	const authorId = '22ae43cd-bfb8-426c-a3b0-5398be3dc93a';

	// Auto-generate slug from title (only if slug is empty)
	$effect(() => {
		if (title && !slug) {
			slug = title
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, '')
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-')
				.trim();
		}
	});

	async function savePost(newStatus?: string) {
		if (!title.trim() || !content.trim()) {
			saveError = 'Title and content are required';
			return false;
		}

		isSaving = true;
		saveError = null;
		
		try {
			const postData = {
				id: postId,
				title: title.trim(),
				slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
				content,
				author: authorId,
				status: newStatus || status,
				featured,
				scheduledAt: scheduledAt || null,
				updatedAt: new Date().toISOString()
			};

			const response = await fetch('/api/posts', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(postData)
			});

			if (!response.ok) {
				throw new Error('Failed to save post');
			}

			status = newStatus || status;
			updatedAt = new Date().toISOString();
			return true;
		} catch (error: any) {
			console.error('Save error:', error);
			saveError = error.message || 'Failed to save post';
			return false;
		} finally {
			isSaving = false;
		}
	}

	async function publishPost() {
		isPublishing = true;
		const success = await savePost('published');
		if (success) {
			goto('/admin');
		}
		isPublishing = false;
	}

	async function schedulePost() {
		if (!scheduledAt) {
			saveError = 'Please select a scheduled date';
			return;
		}
		const success = await savePost('scheduled');
		if (success) {
			goto('/admin');
		}
	}

	async function deletePost() {
		if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
			return;
		}

		isDeleting = true;
		try {
			const response = await fetch(`/api/posts/${postId}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to delete post');
			}

			goto('/admin');
		} catch (error: any) {
			console.error('Delete error:', error);
			saveError = error.message || 'Failed to delete post';
		} finally {
			isDeleting = false;
		}
	}

	function backToDashboard() {
		goto('/admin');
	}

	function viewPost() {
		if (status === 'published') {
			window.open(`/post/${slug}`, '_blank');
		}
	}
</script>

<div class="min-h-screen bg-background">
	<!-- Modern Header with Glass Effect -->
	<div class="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
		<div class="container flex h-16 items-center justify-between px-4">
			<div class="flex items-center gap-4">
				<Button variant="ghost" size="sm" onclick={backToDashboard} class="text-muted-foreground hover:text-foreground">
					← Back
				</Button>
				<div class="flex flex-col">
					<h1 class="text-lg font-semibold">Edit Post</h1>
					<p class="text-sm text-muted-foreground">ID: {postId.slice(0, 8)}...</p>
				</div>
			</div>
			
			<div class="flex items-center gap-2">
				<Badge variant={status === 'published' ? 'default' : status === 'scheduled' ? 'secondary' : 'outline'}>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</Badge>
				
				{#if status === 'published'}
					<Button variant="outline" size="sm" onclick={viewPost}>
						<ExternalLink class="w-4 h-4 mr-1" />
						View Live
					</Button>
				{/if}
				
				<Button 
					variant="outline" 
					size="sm" 
					onclick={() => savePost()}
					disabled={isSaving}
					class="min-w-20"
				>
					{isSaving ? 'Saving...' : 'Save Draft'}
				</Button>
				
				{#if status !== 'published'}
					<Button 
						size="sm" 
						onclick={publishPost}
						disabled={isPublishing || !title.trim() || !content.trim()}
						class="min-w-20"
					>
						{isPublishing ? 'Publishing...' : 'Publish'}
					</Button>
				{/if}

				<Button 
					variant="destructive" 
					size="sm"
					onclick={deletePost}
					disabled={isDeleting}
				>
					<Trash2 class="w-4 h-4" />
				</Button>
			</div>
		</div>
	</div>

	<!-- Main Editor Layout -->
	<div class="container max-w-6xl mx-auto p-4">
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
			<!-- Main Content Area -->
			<div class="lg:col-span-3 space-y-6">
				<!-- Post Meta -->
				<div class="space-y-4 p-6 border rounded-xl bg-card">
					<div class="space-y-2">
						<Label for="title" class="text-sm font-medium">Post Title</Label>
						<Input
							id="title"
							bind:value={title}
							placeholder="Enter your post title..."
							class="text-lg h-12 font-semibold"
						/>
					</div>
					
					<div class="space-y-2">
						<Label for="slug" class="text-sm font-medium">URL Slug</Label>
						<Input
							id="slug"
							bind:value={slug}
							placeholder="post-url-slug"
							class="font-mono text-sm"
						/>
						{#if slug}
							<p class="text-xs text-muted-foreground">Preview: /post/{slug}</p>
						{/if}
					</div>
				</div>

				<!-- Rich Text Editor -->
				<div class="border rounded-xl overflow-hidden bg-card shadow-sm">
					<TipTap
						{postId}
						{title}
						{slug}
						author={authorId}
						initialContent={content}
						onUpdate={(newContent) => content = newContent}
						supabase={data.supabase}
						placeholderText="Continue writing your amazing post..."
					/>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="lg:col-span-1 space-y-6">
				<!-- Publishing Options -->
				<div class="p-4 border rounded-xl bg-card space-y-4">
					<h3 class="font-semibold text-sm">Publishing</h3>
					
					<div class="space-y-3">
						<div class="flex items-center gap-2">
							<input 
								type="checkbox" 
								id="featured" 
								bind:checked={featured}
								class="rounded border-border"
							/>
							<Label for="featured" class="text-sm">Featured Post</Label>
						</div>
						
						<div class="space-y-2">
							<Label class="text-sm">Schedule Publishing</Label>
							<div class="flex gap-2">
								<Input
									type="datetime-local"
									bind:value={scheduledAt}
									class="text-xs"
								/>
								<Button 
									variant="outline" 
									size="sm"
									onclick={schedulePost}
									disabled={!scheduledAt || isSaving}
									class="shrink-0"
								>
									<Calendar class="w-4 h-4" />
								</Button>
							</div>
							{#if scheduledAt}
								<p class="text-xs text-muted-foreground">
									Will publish: {new Date(scheduledAt).toLocaleString()}
								</p>
							{/if}
						</div>
					</div>
				</div>

				<!-- Post Stats -->
				<div class="p-4 border rounded-xl bg-card space-y-3">
					<h3 class="font-semibold text-sm">Post Info</h3>
					<div class="space-y-2 text-xs text-muted-foreground">
						<div>Created: {createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown'}</div>
						<div>Last saved: {updatedAt ? new Date(updatedAt).toLocaleString() : 'Never'}</div>
						<div>Word count: ~{content.replace(/<[^>]*>/g, '').split(' ').filter(w => w.length > 0).length}</div>
						<div>Status: {status}</div>
						{#if featured}
							<div class="text-amber-600">⭐ Featured</div>
						{/if}
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="p-4 border rounded-xl bg-card space-y-3">
					<h3 class="font-semibold text-sm">Quick Actions</h3>
					<div class="space-y-2">
						{#if status === 'published'}
							<Button variant="outline" size="sm" class="w-full justify-start" onclick={viewPost}>
								<ExternalLink class="w-4 h-4 mr-2" />
								View Live Post
							</Button>
						{/if}
						<Button variant="outline" size="sm" class="w-full justify-start" onclick={() => navigator.clipboard.writeText(`/post/${slug}`)}>
							Copy Post URL
						</Button>
					</div>
				</div>
			</div>
		</div>

		<!-- Error Display -->
		{#if saveError}
			<div class="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
				{saveError}
			</div>
		{/if}
	</div>
</div>