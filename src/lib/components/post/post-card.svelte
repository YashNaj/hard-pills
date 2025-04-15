<!-- src/lib/components/posts/post-card.svelte -->
<script>
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";

  // Define props using Svelte 5 syntax
  let { id, title, description, author, date, categories, imageUrl } = $props();
</script>

<Card
  class="overflow-hidden border border-purple-200 hover:border-purple-400 transition-all w-full mb-6"
>
  {#if imageUrl}
    <div class="aspect-video w-full overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
      />
    </div>
  {/if}

  <CardHeader class="pb-2">
    <div class="flex flex-wrap gap-2 mb-2">
      {#each categories as category}
        <Badge
          variant="outline"
          class="bg-purple-100 text-purple-800 border-purple-300"
        >
          {category}
        </Badge>
      {/each}
    </div>
    <CardTitle
      class="text-xl font-bold tracking-tight text-gray-900 line-clamp-2"
    >
      {title}
    </CardTitle>
    <div class="flex items-center text-sm text-gray-500 mt-1">
      <span>{author}</span>
      <span class="mx-1">•</span>
      <span>{date}</span>
    </div>
  </CardHeader>

  <CardContent class="pb-4">
    <CardDescription class="text-gray-600">
      {description}
    </CardDescription>
  </CardContent>

  <CardFooter class="pt-0">
    <Button
      variant="link"
      href={`/post/${id}`}
      class="px-0 text-purple-700 hover:text-purple-900 font-medium"
    >
      Read more
    </Button>
  </CardFooter>
</Card>
