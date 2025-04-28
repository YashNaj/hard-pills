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
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let { id, title, description, author, date, categories, imageUrl } = $props();

  function formatDate(dateString) {
    try {
      return new Date(dateString + "T00:00:00Z").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
    } catch (e) {
      return dateString;
    }
  }

  // --- View Transition Setup ---
  let viewTransitionStyleBase = $state("");
  onMount(() => {
    if (browser && "startViewTransition" in document) {
      viewTransitionStyleBase = "view-transition-name: ";
    }
  });

  // Names for elements that should morph
  const imageTransitionName = $derived(
    viewTransitionStyleBase
      ? `${viewTransitionStyleBase} post-${id}-image`
      : "",
  );
  const titleTransitionName = $derived(
    viewTransitionStyleBase
      ? `${viewTransitionStyleBase} post-${id}-title`
      : "",
  );
  const categoriesTransitionName = $derived(
    viewTransitionStyleBase
      ? `${viewTransitionStyleBase} post-${id}-categories`
      : "",
  ); // For the wrapper div
  const metaTransitionName = $derived(
    viewTransitionStyleBase ? `${viewTransitionStyleBase} post-${id}-meta` : "",
  ); // For the author/date div
  // --- End View Transition Setup ---
</script>

<Card
  class="comic-panel border-4 border-black bg-pills-pink shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] transition-shadow duration-200 w-full mb-8 rounded-none overflow-hidden flex flex-col"
>
  {#if imageUrl}
    <div class="m-4 p-1 bg-black transform -rotate-2 origin-center">
      <div class="overflow-hidden border-2 border-gray-300 bg-white">
        <!-- IMAGE: Add transition name -->
        <img
          src={imageUrl}
          alt={title}
          class="block w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
          style={imageTransitionName}
        />
      </div>
    </div>
  {/if}

  <CardHeader class="p-4 pt-2 flex-grow">
    <!-- CATEGORIES WRAPPER: Add transition name -->
    <div class="flex flex-wrap gap-2 mb-3" style={categoriesTransitionName}>
      {#each categories as category}
        <Badge
          variant="default"
          class="bg-purple-600 text-white border border-black px-2 py-0.5 rounded-sm text-xs uppercase font-semibold tracking-wide"
        >
          {category}
        </Badge>
      {/each}
    </div>
    <!-- TITLE: Add transition name -->
    <CardTitle
      class="text-xl md:text-2xl font-extrabold uppercase text-black !mt-0 line-clamp-3"
      style="{titleTransitionName} font-family: 'Bangers', cursive; letter-spacing: 1px;"
    >
      {title}
    </CardTitle>
    <!-- META: Add transition name -->
    <div
      class="flex items-center text-xs uppercase text-gray-800 mt-2 font-semibold"
      style={metaTransitionName}
    >
      <span>{author}</span>
      <span class="mx-2">•</span>
      <span>{formatDate(date)}</span>
    </div>
  </CardHeader>

  <CardContent class="p-4 pt-0 pb-2">
    <CardDescription class="text-sm text-black line-clamp-4">
      {description}
    </CardDescription>
  </CardContent>

  <CardFooter class="p-4 pt-2">
    <Button
      variant="link"
      href={`/post/${id}`}
      class="px-0 text-purple-700 hover:text-black uppercase font-bold text-sm tracking-wider"
    >
      Read more »
    </Button>
  </CardFooter>
</Card>
