<script lang='ts'>
	import TipTap from '../components/tip-tap.svelte';
	import SubmissionsTable from '../components/submissions-table.svelte';
	import PostCreationForm from '../components/post-creation-form.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Plus, Inbox } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	let { data } = $props();
	
	let title = $state('');
	let slug = $state('');
	let content = $state('');
	let postId = $state<string | null>(null);
	let showEditor = $state(false);
	let submissionsTableKey = $state(0); // For triggering table refresh
	
	// Mock user ID for testing
	const authorId = '22ae43cd-bfb8-426c-a3b0-5398be3dc93a';
	
	onMount(async () => {
		// Check if editing existing post
		const urlParams = new URLSearchParams(window.location.search);
		const editId = urlParams.get('edit');
		
		if (editId) {
			try {
				const response = await fetch(`/api/posts?id=${editId}`);
				if (response.ok) {
					const { post } = await response.json();
					title = post.title;
					slug = post.slug;
					content = post.content;
					postId = post.id;
					showEditor = true;
				}
			} catch (error) {
				console.error('Failed to load post:', error);
			}
		}
	});
	
	function refreshSubmissionsTable() {
		submissionsTableKey += 1; // Force component refresh
	}
	
	function backToDashboard() {
		showEditor = false;
		postId = null;
		title = '';
		slug = '';
		content = '';
		goto('/admin', { replaceState: true });
	}

	let isEditMode= $derived(showEditor && postId ? true : false);
	$inspect(isEditMode)

	$effect(() => {
		if (isEditMode && postId) {
			goto(`/admin/editor/${postId}`, { replaceState: true });
		}
	});
</script>

<!-- Dashboard View -->
<div class="h-full flex flex-col bg-pink-50">
	<!-- Header -->
	<div class="flex-none p-6 border-b bg-pink-50">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">Dashboard</h1>
				<p class="text-muted-foreground">Manage your content</p>
			</div>
			<Button onclick={() => goto('/admin/editor')} class="gap-2">
				<Plus class="w-4 h-4" />
				New Post
			</Button>
		</div>
	</div>
	<div class = 'content-area gap-2 w-full flex flex-1 min-h-0 px-6 gap-x-4 py-4'>
		<div class = 'h-full flex flex-col flex-2 '>
			<Card class="flex flex-col max-h-full h-full">
				<CardHeader class="flex-none sticky top-0 bg-pink-50">
					<CardTitle class="flex items-center gap-2">
						<Inbox class="h-5 w-5" />
						Recent Submissions
						{#if data.meta?.pendingSubmissions > 0}
							<Badge variant="outline" class="ml-auto">
								{data.meta.pendingSubmissions} pending
							</Badge>
						{/if}
					</CardTitle>
				</CardHeader>
				<CardContent class="-40 overflow-y-auto flex-grow px-6 min-h-0">
					{#key submissionsTableKey}
						<SubmissionsTable submissions={data.submissions} />
					{/key}
				</CardContent>
			</Card>
		</div>
		<div class = 'flex-1'>
			<div class="h-full">
				<PostCreationForm onPostCreated={refreshSubmissionsTable} />
			</div>
		</div>

	</div>
</div>
