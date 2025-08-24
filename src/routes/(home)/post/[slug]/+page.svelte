<!-- src/routes/post/[slug]/+page.svelte -->
<script lang="ts">
  import type { PageData } from "./$types";
  import { ArticlePost } from "../../components"; // Import from shared components
  import { browser } from "$app/environment";
  import { fade } from "svelte/transition"; // Optional basic transition for the whole page

  // The 'data' prop contains the object returned from your load function
  let { data }: { data: PageData } = $props();

  // You can access the post via data.post
  const post = $derived(data.post);
</script>

{#if post}
  <!-- Pass the loaded post data to your article component -->
  <ArticlePost {post} />
{:else}
  <!-- This part might not be strictly necessary if the load function -->
  <!-- always throws an error for non-existent posts, but can be a fallback -->
  <p class="container mx-auto text-center py-12">
    Loading post or post not found...
  </p>
{/if}
