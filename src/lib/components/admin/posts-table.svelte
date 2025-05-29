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
	import { Edit, Eye, Trash2, Calendar } from 'lucide-svelte';
	
	let posts = $state([]);
	let loading = $state(true);
	
	onMount(async () => {
		await loadPosts();
	});
	
	async function loadPosts() {
		try {
			const response = await fetch('/api/posts');
			if (response.ok) {
				const data = await response.json();
				posts = data.posts || [];
			}
		} catch (error) {
			console.error('Failed to load posts:', error);
		} finally {
			loading = false;
		}
	}
	
	function getStatusVariant(status: string) {
		switch (status) {
			case 'published':
				return 'default';
			case 'draft':
				return 'secondary';
			case 'scheduled':
				return 'outline';
			case 'archived':
				return 'destructive';
			default:
				return 'secondary';
		}
	}
	
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
	
	function truncateTitle(title: string, maxLength = 40) {
		return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
	}
	
	async function deletePost(postId: string) {
		if (!confirm('Are you sure you want to delete this post?')) return;
		
		try {
			const response = await fetch(`/api/posts/${postId}`, {
				method: 'DELETE'
			});
			
			if (response.ok) {
				await loadPosts(); // Refresh the list
			} else {
				alert('Failed to delete post');
			}
		} catch (error) {
			console.error('Delete error:', error);
			alert('Failed to delete post');
		}
	}
</script>

<Card class="h-full">
	<CardHeader>
		<CardTitle class="flex items-center gap-2">
			<Calendar class="h-5 w-5" />
			Recent Posts
		</CardTitle>
	</CardHeader>
	<CardContent class="p-0">
		{#if loading}
			<div class="p-6 text-center text-muted-foreground">
				Loading posts...
			</div>
		{:else if posts.length === 0}
			<div class="p-6 text-center text-muted-foreground">
				No posts yet. Create your first post!
			</div>
		{:else}
			<div class="max-h-[600px] overflow-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Created</TableHead>
							<TableHead class="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each posts as post (post.id)}
							<TableRow>
								<TableCell class="font-medium">
									{truncateTitle(post.title)}
								</TableCell>
								<TableCell>
									<Badge variant={getStatusVariant(post.status)}>
										{post.status}
									</Badge>
								</TableCell>
								<TableCell class="text-muted-foreground">
									{formatDate(post.createdAt)}
								</TableCell>
								<TableCell class="text-right">
									<div class="flex items-center justify-end gap-1">
										<Button
											variant="ghost"
											size="sm"
											href="/admin?edit={post.id}"
											class="h-8 w-8 p-0"
										>
											<Edit class="h-4 w-4" />
										</Button>
										{#if post.status === 'published'}
											<Button
												variant="ghost"
												size="sm"
												href="/post/{post.id}"
												target="_blank"
												class="h-8 w-8 p-0"
											>
												<Eye class="h-4 w-4" />
											</Button>
										{/if}
										<Button
											variant="ghost"
											size="sm"
											onclick={() => deletePost(post.id)}
											class="h-8 w-8 p-0 text-destructive hover:text-destructive"
										>
											<Trash2 class="h-4 w-4" />
										</Button>
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