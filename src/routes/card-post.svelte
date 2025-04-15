<!-- lib/components/card-post.svelte -->
<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";

  // Proper Svelte 5 props syntax
  let { post } = $props();
</script>

<a href="/post/{post.slug}" class="block">
  <Card.Root
    class="overflow-hidden bg-background w-80 text-white h-80 transition-all duration-300 hover:shadow-md"
    style="view-transition-name: post-{post.id}-card;"
  >
    <div class="aspect-video relative overflow-hidden">
      <img
        src={post.image}
        alt={post.title}
        class="w-full h-full object-cover"
        style="view-transition-name: post-{post.id}-image;"
      />
    </div>

    <Card.Content
      class="p-4 bg-background"
      style="view-transition-name: post-{post.id}-card-content;"
    >
      <h2
        class="text-xl font-semibold mb-2"
        style="view-transition-name: post-{post.id}-title;"
      >
        {post.title}
      </h2>

      <p
        class="text-muted-foreground text-sm mb-4"
        style="view-transition-name: post-{post.id}-caption;"
      >
        {post.caption}
      </p>

      <div
        class="flex items-center justify-between"
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

        <Button variant="ghost" size="sm" class="gap-1">
          Read more
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
            class="lucide lucide-arrow-right"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Button>
      </div>
    </Card.Content>
  </Card.Root>
</a>
