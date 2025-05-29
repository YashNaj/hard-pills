<script lang="ts">
	import { onMount } from 'svelte';
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
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Edit, Eye, Trash2, Calendar, Search, Filter } from 'lucide-svelte';
	
	let { posts = [], showHeader = true, showSearch = true } = $props<{ 
		posts?: any[]; 
		showHeader?: boolean;
		showSearch?: boolean;
	}>();
	
	let loading = $state(false);
	let searchQuery = $state('');
	let statusFilter = $state('all');
	
	let filteredPosts = $derived(() => {
		let filtered = posts;
		
		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			filtered = filtered.filter(post => {
				const title = (post.title || '').toLowerCase();
				const content = (post.content || '').toLowerCase();
				const slug = (post.slug || '').toLowerCase();
				
				return title.includes(query) || 
				       content.includes(query) || 
				       slug.includes(query);
			});
		}
		
		// Filter by status
		if (statusFilter !== 'all') {
			filtered = filtered.filter(post => post.status === statusFilter);
		}
		
		return filtered;
	});
	
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

{#if showHeader}
<Card class="h-full">
	<CardHeader>
		<CardTitle class="flex items-center gap-2">
			<Calendar class="h-5 w-5" />
			Recent Posts
		</CardTitle>
	</CardHeader>
	{#if showSearch}
	<div class="px-6 pb-4">
		<div class="flex gap-4">
			<div class="flex-1">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						bind:value={searchQuery}
						placeholder="Search posts..."
						class="pl-10"
					/>
				</div>
			</div>
			<div class="w-48">
				<select
					bind:value={statusFilter}
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					<option value="all">All Status</option>
					<option value="published">Published</option>
					<option value="draft">Draft</option>
					<option value="scheduled">Scheduled</option>
					<option value="archived">Archived</option>
				</select>
			</div>
		</div>
	</div>
	{/if}
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
{:else}
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
{/if}
