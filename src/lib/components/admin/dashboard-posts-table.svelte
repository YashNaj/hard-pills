<script lang="ts">
	import { onMount } from 'svelte';
	import PostsTable from './posts-table.svelte';
	
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
</script>

<PostsTable {posts} showHeader={true} />