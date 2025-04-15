<!-- src/lib/components/posts/featured-post.svelte -->
<script>
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";

  // Define props using Svelte 5 syntax
  let { id, title, description, author, date, categories, imageUrl } = $props();
</script>

<div
  class="relative w-screen bg-gradient-to-r from-purple-700/90 to-purple-500 backdrop-saturate-50 backdrop-blur-lg bg-white/90 overflow-hidden mb-10"
>
  <div class="absolute inset-0 opacity-20">
    {#if imageUrl}
      <img src={imageUrl} alt="" class="w-full h-full object-cover" />
    {/if}
  </div>

  <div class="relative z-10 p-8 md:p-12">
    <h2 class="text-white text-4xl mb-2 text-shadow-xs text-shadow-pills-pink">
      FEATURED
    </h2>
    <!-- Content -->
    <div class="text-white">
      <div class="flex flex-wrap gap-2 mb-4">
        {#each categories as category}
          <Badge
            class="bg-white/20 hover:bg-white/30 text-white border-transparent"
          >
            {category}
          </Badge>
        {/each}
      </div>

      <h2 class="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
        {title}
      </h2>

      <p class="text-white/80 mb-6">
        {description}
      </p>

      <div class="flex items-center text-sm text-white/70 mb-6">
        <span>{author}</span>
        <span class="mx-1">•</span>
        <span>{date}</span>
      </div>

      <Button
        href={`/post/${id}`}
        variant="outline"
        class="bg-transparent border-white text-white hover:bg-white hover:text-purple-900"
      >
        Read Article
      </Button>
    </div>
  </div>
</div>
