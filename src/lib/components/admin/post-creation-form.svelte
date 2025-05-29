<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Select } from '$lib/components/ui/select';
	import { PenTool, Plus, Loader2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	
	let { onPostCreated = () => {} } = $props<{ onPostCreated?: () => void }>();
	
	let title = $state('');
	let slug = $state('');
	let excerpt = $state('');
	let status = $state('draft');
	let featured = $state(false);
	let isCreating = $state(false);
	
	// Mock user ID for testing
	const authorId = '22ae43cd-bfb8-426c-a3b0-5398be3dc93a';
	
	function generateSlug() {
		slug = title
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
	}
	
	async function createPost() {
		if (!title || !slug) {
			alert('Please enter a title and slug');
			return;
		}
		
		isCreating = true;
		
		try {
			const response = await fetch('/api/posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					slug,
					content: excerpt || '<p>Start writing your post...</p>',
					author: authorId,
					status,
					featured
				})
			});
			
			if (response.ok) {
				const { post } = await response.json();
				
				// Reset form
				title = '';
				slug = '';
				excerpt = '';
				status = 'draft';
				featured = false;
				
				// Callback to refresh posts table
				onPostCreated();
				
				// Navigate to editor
				goto(`/admin?edit=${post.id}`);
			} else {
				throw new Error('Failed to create post');
			}
		} catch (error) {
			console.error('Error creating post:', error);
			alert('Failed to create post');
		} finally {
			isCreating = false;
		}
	}
	
	async function createAndEdit() {
		await createPost();
	}
	
	function quickCreate() {
		if (!title) {
			alert('Please enter a title');
			return;
		}
		
		if (!slug) {
			generateSlug();
		}
		
		createPost();
	}
</script>

<Card class="h-full">
	<CardHeader>
		<CardTitle class="flex items-center gap-2">
			<PenTool class="h-5 w-5" />
			Create New Post
		</CardTitle>
	</CardHeader>
	<CardContent class="space-y-6">
		<!-- Title & Slug -->
		<div class="space-y-4">
			<div class="space-y-2">
				<Label for="new-title">Title</Label>
				<Input
					id="new-title"
					bind:value={title}
					placeholder="Enter your post title..."
					oninput={generateSlug}
					disabled={isCreating}
				/>
			</div>
			
			<div class="space-y-2">
				<Label for="new-slug">Slug</Label>
				<Input
					id="new-slug"
					bind:value={slug}
					placeholder="post-url-slug"
					disabled={isCreating}
				/>
			</div>
		</div>
		
		<!-- Excerpt -->
		<div class="space-y-2">
			<Label for="excerpt">Excerpt (Optional)</Label>
			<Textarea
				id="excerpt"
				bind:value={excerpt}
				placeholder="Brief description of your post..."
				rows={3}
				disabled={isCreating}
			/>
		</div>
		
		<!-- Post Options -->
		<div class="space-y-4">
			<div class="space-y-2">
				<Label for="status">Status</Label>
				<select
					id="status"
					bind:value={status}
					disabled={isCreating}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<option value="draft">Draft</option>
					<option value="published">Published</option>
					<option value="scheduled">Scheduled</option>
				</select>
			</div>
			
			<div class="flex items-center space-x-2">
				<input
					type="checkbox"
					id="featured"
					bind:checked={featured}
					disabled={isCreating}
					class="h-4 w-4 rounded border-gray-300"
				/>
				<Label for="featured" class="text-sm font-normal">
					Featured post
				</Label>
			</div>
		</div>
		
		<!-- Action Buttons -->
		<div class="space-y-3">
			<Button 
				onclick={createAndEdit}
				disabled={!title || !slug || isCreating}
				class="w-full"
			>
				{#if isCreating}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Creating...
				{:else}
					<Plus class="mr-2 h-4 w-4" />
					Create & Edit
				{/if}
			</Button>
			
			<Button 
				variant="outline"
				onclick={quickCreate}
				disabled={!title || isCreating}
				class="w-full"
			>
				Quick Create
			</Button>
		</div>
		
		<!-- Help Text -->
		<div class="text-xs text-muted-foreground space-y-1">
			<p><strong>Create & Edit:</strong> Creates the post and opens the editor</p>
			<p><strong>Quick Create:</strong> Creates the post and stays on dashboard</p>
		</div>
	</CardContent>
</Card>