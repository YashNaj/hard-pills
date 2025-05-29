<script lang="ts">
	import PostsTable from '$lib/components/admin/posts-table.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Select } from '$lib/components/ui/select';
	import { 
		FileText, 
		Plus, 
		Search, 
		Filter,
		Eye,
		Edit,
		Calendar
	} from 'lucide-svelte';
	
	let { data } = $props();
	
	let searchQuery = $state('');
	let statusFilter = $state('all');
	let filteredPosts = $derived(() => {
		const posts = data.posts || [];
		
		if (!searchQuery.trim() && statusFilter === 'all') {
			return posts;
		}
		
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
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Posts</h1>
			<p class="text-muted-foreground">Manage all your blog posts</p>
		</div>
		<Button href="/admin?new=true">
			<Plus class="mr-2 h-4 w-4" />
			New Post
		</Button>
	</div>
	
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Total Posts</CardTitle>
				<FileText class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{data.meta.total}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Published</CardTitle>
				<Eye class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-green-600">{data.meta.published}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Drafts</CardTitle>
				<Edit class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-yellow-600">{data.meta.draft}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Scheduled</CardTitle>
				<Calendar class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-blue-600">{data.meta.scheduled}</div>
			</CardContent>
		</Card>
	</div>
	
	<!-- Filters -->
	<Card>
		<CardHeader>
			<CardTitle class="text-lg">Filter Posts</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="flex flex-col sm:flex-row gap-4">
				<div class="flex-1">
					<div class="relative">
						<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							bind:value={searchQuery}
							placeholder="Search posts by title or content..."
							class="pl-10"
						/>
					</div>
				</div>
				
				<div class="sm:w-48">
					<select
						bind:value={statusFilter}
						class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<option value="all">All Status</option>
						<option value="published">Published</option>
						<option value="draft">Draft</option>
						<option value="scheduled">Scheduled</option>
						<option value="archived">Archived</option>
					</select>
				</div>
			</div>
			
			{#if searchQuery || statusFilter !== 'all'}
				<div class="flex items-center gap-2">
					<span class="text-sm text-muted-foreground">
						Showing {filteredPosts.length} of {data.meta.total} posts
					</span>
					{#if searchQuery}
						<Badge variant="secondary">
							Search: "{searchQuery}"
						</Badge>
					{/if}
					{#if statusFilter !== 'all'}
						<Badge variant="secondary">
							Status: {statusFilter}
						</Badge>
					{/if}
				</div>
			{/if}
		</CardContent>
	</Card>
	
	<!-- Posts Table -->
	<Card>
		<CardHeader>
			<CardTitle>All Posts</CardTitle>
		</CardHeader>
		<CardContent class="p-0">
			<div class="p-4 bg-gray-100 text-sm">
				DEBUG: Raw data.posts.length = {data.posts?.length || 0}<br>
				DEBUG: filteredPosts.length = {filteredPosts.length}<br>
				DEBUG: searchQuery = "{searchQuery}"<br>
				DEBUG: statusFilter = "{statusFilter}"
			</div>
			{#if filteredPosts.length === 0}
				<div class="p-8 text-center text-muted-foreground">
					{#if searchQuery || statusFilter !== 'all'}
						No posts match your current filters.
					{:else}
						No posts found. Create your first post!
					{/if}
				</div>
			{:else}
				<!-- We can reuse the PostsTable component but pass filtered data -->
				<div class="overflow-auto">
					<PostsTable posts={filteredPosts} showHeader={false} />
				</div>
			{/if}
		</CardContent>
	</Card>
</div>