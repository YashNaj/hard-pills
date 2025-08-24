<!-- src/lib/components/posts/post-list.svelte -->
<script>
  import PostCard from "./post-card.svelte";

  // Define props using Svelte 5 syntax
  let { posts } = $props();
</script>

<div class="space-y-8">
  {#each posts as post (post.id)}
    <PostCard
      slug={post.slug}
      title={post.title}
      description={post.description}
      author={post.author}
      date={post.date}
      categories={post.categories}
      imageUrl={post.imageUrl}
    />
  {/each}
</div>

{#if posts.length === 0}
  <div class="text-center py-16 px-4">
    <h3 class="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
    <p class="text-gray-600">Check back later for new content.</p>
  </div>
{/if}
