<script lang='ts'>
	import TipTap from '$lib/components/admin/tip-tap.svelte';
	import SubmissionsTable from '$lib/components/admin/submissions-table.svelte';
	import PostCreationForm from '$lib/components/admin/post-creation-form.svelte';
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
</script>

{#if showEditor && postId}
	<!-- Editor View -->
	<div class="max-w-6xl mx-auto">
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-3xl font-bold">Edit Post</h1>
			<button
				onclick={backToDashboard}
				class="text-sm text-muted-foreground hover:text-foreground"
			>
				← Back to Dashboard
			</button>
		</div>
		
		<div class="border rounded-lg">
			<TipTap
				{postId}
				{title}
				{slug}
				author={authorId}
				initialContent={content}
				onUpdate={(newContent) => content = newContent}
				supabase={data.supabase}
			/>
		</div>
	</div>
{:else}
	<!-- Dashboard View -->
	<div class="space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">Dashboard</h1>
			<p class="text-muted-foreground">Manage your content</p>
		</div>
		
		<!-- Split Layout: Submissions Table | Post Creation -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
			<!-- Left Half: Submissions Table -->
			<div class="h-full">
				{#key submissionsTableKey}
					<SubmissionsTable />
				{/key}
			</div>
			
			<!-- Right Half: Post Creation Form -->
			<div class="h-full">
				<PostCreationForm onPostCreated={refreshSubmissionsTable} />
			</div>
		</div>
	</div>
{/if}
