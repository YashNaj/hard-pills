<script lang='ts'>
	import TipTap from '../components/tip-tap.svelte';
	import SubmissionsTable from '../components/submissions-table.svelte';
	import PostCreationForm from '../components/post-creation-form.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
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
	<div class="space-y-6">
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
