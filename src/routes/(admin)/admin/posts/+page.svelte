<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { FileText, Plus, Eye, Edit, Calendar, MoreHorizontal, Trash2, Copy } from "lucide-svelte";
	import { Badge } from "$lib/components/ui/badge";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

	let { data } = $props();

	async function publishPost(postId: string) {
		try {
			const response = await fetch(`/api/posts/${postId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: 'published' })
			});

			if (response.ok) {
				// Reload the page to show updated status
				window.location.reload();
			} else {
				alert('Failed to publish post');
			}
		} catch (error) {
			console.error('Publish error:', error);
			alert('Failed to publish post');
		}
	}

	async function deletePost(postId: string, title: string) {
		if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
			return;
		}

		try {
			const response = await fetch(`/api/posts/${postId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				// Reload the page to show updated list
				window.location.reload();
			} else {
				alert('Failed to delete post');
			}
		} catch (error) {
			console.error('Delete error:', error);
			alert('Failed to delete post');
		}
	}
</script>

<div class="space-y-6 p-6">
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
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Total Posts</CardTitle>
				<FileText class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{data.meta.total}</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Published</CardTitle>
				<Eye class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-green-600">
					{data.meta.published}
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Drafts</CardTitle>
				<Edit class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-yellow-600">{data.meta.draft}</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader
				class="flex flex-row items-center justify-between space-y-0 pb-2"
			>
				<CardTitle class="text-sm font-medium">Scheduled</CardTitle>
				<Calendar class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-blue-600">
					{data.meta.scheduled}
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Posts Data Table -->
	<Card>
		<CardHeader>
			<CardTitle>Posts</CardTitle>
		</CardHeader>
		<CardContent>
			{#if data.posts?.length}
				<div class="space-y-4">
					{#each data.posts as post}
						<div class="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-3 mb-2">
									<h3 class="text-lg font-semibold text-foreground truncate">
										{post.title}
									</h3>
									{#if post.featured}
										<Badge variant="secondary" class="bg-yellow-100 text-yellow-800">
											Featured
										</Badge>
									{/if}
									<Badge variant={post.status === 'published' ? 'default' : post.status === 'draft' ? 'secondary' : 'outline'} class="capitalize">
										{post.status}
									</Badge>
								</div>
								
								<div class="flex items-center gap-4 text-sm text-muted-foreground">
									<div class="flex items-center gap-1">
										<Calendar class="h-4 w-4" />
										{new Date(post.createdAt).toLocaleDateString()}
									</div>
									<div class="truncate max-w-[200px]">
										/{post.slug}
									</div>
								</div>
							</div>

							<div class="flex items-center gap-2">
								<Button href="/admin/editor/{post.id}" variant="outline" size="sm">
									<Edit class="h-4 w-4 mr-1" />
									Edit
								</Button>
								
								{#if post.status === 'published'}
									<Button href="/post/{post.slug}" target="_blank" variant="outline" size="sm">
										<Eye class="h-4 w-4 mr-1" />
										View
									</Button>
								{:else}
									<Button onclick={() => publishPost(post.id)} variant="default" size="sm">
										<Eye class="h-4 w-4 mr-1" />
										Publish
									</Button>
								{/if}
								
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										{#snippet child({ props })}
											<Button {...props} variant="ghost" size="sm" class="h-8 w-8 p-0">
												<MoreHorizontal class="h-4 w-4" />
											</Button>
										{/snippet}
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end" class="w-56 bg-popover border border-border shadow-md">
										<DropdownMenu.Group>
											<DropdownMenu.Label class="px-2 py-1.5 text-sm font-semibold">
												Actions
											</DropdownMenu.Label>
											<DropdownMenu.Item 
												onclick={() => navigator.clipboard.writeText(post.id)}
												class="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
											>
												<Copy class="h-4 w-4" />
												Copy ID
											</DropdownMenu.Item>
											<DropdownMenu.Item 
												onclick={() => navigator.clipboard.writeText(`/post/${post.slug}`)}
												class="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
											>
												<Copy class="h-4 w-4" />
												Copy URL
											</DropdownMenu.Item>
										</DropdownMenu.Group>
										<DropdownMenu.Separator class="my-1 h-px bg-border" />
										<DropdownMenu.Item 
											onclick={() => deletePost(post.id, post.title)}
											class="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-destructive/10 text-destructive"
										>
											<Trash2 class="h-4 w-4" />
											Delete Post
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-8 text-center">
					<FileText class="h-12 w-12 text-muted-foreground mb-4" />
					<h3 class="text-lg font-semibold">No posts found</h3>
					<p class="text-muted-foreground mb-4">
						Get started by creating your first post.
					</p>
					<Button href="/admin?new=true">
						<Plus class="mr-2 h-4 w-4" />
						Create Post
					</Button>
				</div>
			{/if}
		</CardContent>
	</Card>
</div>

