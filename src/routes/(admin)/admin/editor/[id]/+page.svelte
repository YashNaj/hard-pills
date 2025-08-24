<script lang='ts'>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly, scale, fade } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';
	import TipTap from '../../../components/tip-tap.svelte';
	import BannerImageUpload from '../../../components/banner-image-upload.svelte';
	import PostPreviewModal from '../../../components/post-preview-modal.svelte';
	import SubmissionViewer from '../../../components/submission-viewer.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Calendar, ExternalLink, Trash2, Eye, Settings, FileText, MessageSquare } from 'lucide-svelte';

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
	let headerImageId = $state<string | null>(data.post?.headerImageId || null);
	let headerImageUrl = $state<string | null>(data.post?.headerImageUrl || null);
	let submissionId = $state<string | null>(data.post?.submissionId || data.submissionId || null);
	
	// Related submission data
	const relatedSubmission = data.relatedSubmission;
	
	// UI state
	let isSaving = $state(false);
	let saveError = $state<string | null>(null);
	let isPublishing = $state(false);
	let isDeleting = $state(false);
	let showPreview = $state(false);
	let showEditorSidebar = $state(true); // Local editor sidebar state

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
				submissionId: submissionId,
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

	function handleBannerImageChange(imageId: string | null, imageUrl: string | null) {
		headerImageId = imageId;
		headerImageUrl = imageUrl;
	}
</script>

<div class="min-h-full mt-6 overflow-auto px-6 bg-background ">
	<!-- Modern Header with Glass Effect -->
	<div class="z-[9] border-b sticky-top-0">
		<div class="container flex h-16 w-full items-center gap-4">
			<Button variant="ghost" size="sm" onclick={backToDashboard} class="text-muted-foreground hover:text-foreground flex-shrink-0">
				← Back
			</Button>
			
			<!-- Title Input - Takes most space -->
			<div class="flex-1 min-w-0">
				<Input
					id="title"
					bind:value={title}
					placeholder="Enter your post title..."
					class="text-lg font-semibold bg-transparent border-none shadow-none px-2 h-12 focus:bg-background focus:border-border focus:shadow-sm transition-all"
				/>
			</div>
			
			<!-- Slug Input - Compact -->
			<div class="flex items-center gap-1 text-sm flex-shrink-0">
				<span class="text-muted-foreground font-mono text-xs">/post/</span>
				<Input
					id="slug"
					bind:value={slug}
					placeholder="url-slug"
					class="font-mono text-xs h-8 w-24 focus:w-32 transition-all duration-200 bg-muted/50 border-muted-foreground/20"
				/>
			</div>
			
			<div class="flex items-center gap-2 flex-shrink-0">
				<Badge variant={status === 'published' ? 'default' : status === 'scheduled' ? 'secondary' : 'outline'}>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</Badge>
				
				<Button variant="outline" size="sm" onclick={() => showPreview = true}>
					<Eye class="w-4 h-4 mr-1" />
					Preview
				</Button>
				
				<Button 
					variant="outline" 
					size="sm" 
					onclick={() => showEditorSidebar = !showEditorSidebar}
					class="transition-all duration-200 hover:shadow-md {showEditorSidebar ? 'bg-primary text-primary-foreground' : ''}"
				>
					<Settings class="w-4 h-4 mr-1 transition-transform duration-200 {showEditorSidebar ? 'rotate-90' : ''}" />
					{showEditorSidebar ? 'Hide' : 'Show'} Panel
				</Button>
				
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

	<!-- Main Editor Content -->
	<div class="flex-1 flex flex-col overflow-hidden">

		<!-- Editor and Sidebar Container -->
		<div class="flex-1 flex overflow-hidden">
			<!-- Rich Text Editor -->
			<div class="flex-1 bg-background transition-all duration-500 ease-out overflow-hidden">
				<TipTap
					{postId}
					{title}
					{slug}
					author={authorId}
					initialContent={content}
					onUpdate={(newContent) => content = newContent}
					supabase={data.supabase}
					placeholderText="Start writing your amazing post..."
				/>
			</div>
			
			<!-- Embedded Editor Sidebar Panel -->
			{#if showEditorSidebar}
				<div 
					class="w-80 bg-muted/20 border-l border-border overflow-auto flex-shrink-0 max-h-full overflow-auto"
					in:fly={{ x: 320, duration: 400, easing: quintOut }}
					out:fly={{ x: 320, duration: 300, easing: quintOut }}
				>
					<div class="p-4 space-y-4">
						{#if relatedSubmission}
							<!-- Tabs for Submission and Settings -->
							<Tabs value="submission" class="w-full">
								<TabsList class="grid w-full grid-cols-2">
									<TabsTrigger value="submission" class="flex items-center gap-2 text-xs">
										<MessageSquare class="w-3 h-3" />
										Submission
									</TabsTrigger>
									<TabsTrigger value="settings" class="flex items-center gap-2 text-xs">
										<Settings class="w-3 h-3" />
										Settings
									</TabsTrigger>
								</TabsList>
								
								<TabsContent value="submission" class="space-y-4 mt-4">
									<SubmissionViewer submission={relatedSubmission} />
								</TabsContent>
								
								<TabsContent value="settings" class="space-y-4 mt-4">
									<!-- Banner Image Upload -->
									<BannerImageUpload 
										{postId}
										supabase={data.supabase}
										bind:currentImageId={headerImageId}
										bind:currentImageUrl={headerImageUrl}
										onImageChange={handleBannerImageChange}
									/>
									
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
										
										<!-- Post Stats -->
										<div class="p-4 border rounded-xl bg-card space-y-3">
											<h3 class="font-semibold text-sm">Post Info</h3>
											<div class="space-y-2 text-xs text-muted-foreground">
												<div>Created: {createdAt ? new Date(createdAt).toLocaleDateString() : 'New post'}</div>
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
								</TabsContent>
							</Tabs>
						{:else}
							<!-- No submission - show regular settings -->
							<!-- Banner Image Upload -->
							<BannerImageUpload 
								{postId}
								supabase={data.supabase}
								bind:currentImageId={headerImageId}
								bind:currentImageUrl={headerImageUrl}
								onImageChange={handleBannerImageChange}
							/>
							
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
									<div>Created: {createdAt ? new Date(createdAt).toLocaleDateString() : 'New post'}</div>
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
						{/if}
						
						<!-- Error Display -->
						{#if saveError}
							<div class="p-4 border rounded-xl bg-destructive/10 border-destructive/20 text-destructive text-sm">
								{saveError}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Preview Modal -->
<PostPreviewModal
	bind:open={showPreview}
	{title}
	{content}
	{slug}
	{headerImageUrl}
	{status}
	{createdAt}
/>
