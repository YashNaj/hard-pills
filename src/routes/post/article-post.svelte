<!-- lib/components/article-post.svelte -->
<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  // Proper Svelte 5 props syntax
  let { post } = $props();
</script>

<article class="max-w-3xl mx-auto py-8 text-white">
  <div class="mb-8 aspect-[16/9] relative">
    <img
      src={post.image}
      alt={post.title}
      class="w-full h-full object-cover rounded-lg"
      style="view-transition-name: post-{post.id}-image;"
    />
  </div>

  <div
    class="bg-white dark:bg-gray-900 rounded-lg p-8 -mt-24 relative z-10"
    style="view-transition-name: post-{post.id}-card-content;"
  >
    <header class="mb-8">
      <h1
        class="text-4xl font-bold tracking-tight mb-4 scroll-m-20"
        style="view-transition-name: post-{post.id}-title;"
      >
        {post.title}
      </h1>

      <p
        class="text-xl text-muted-foreground mb-4"
        style="view-transition-name: post-{post.id}-caption;"
      >
        {post.caption}
      </p>

      <div
        class="flex items-center gap-4"
        style="view-transition-name: post-{post.id}-meta;"
      >
        <Badge variant="outline" class="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-eye"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>{post.views} views</span>
        </Badge>

        <a href="/" class="inline-flex">
          <Button variant="ghost" size="sm" class="gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to posts
          </Button>
        </a>
      </div>
    </header>

    <div
      class="prose prose-stone dark:prose-invert max-w-none"
      style="view-transition-name: post-{post.id}-content;"
    >
      {@html post.content}
    </div>
  </div>
</article>
