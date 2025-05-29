<script lang="ts">
  import { PostCard, PostList, FeaturedPost } from "$lib/components/post";
  import { featuredPost, recentPosts } from "$lib/data/posts";
  import { Button } from "$lib/components/ui/button";
  import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  } from "$lib/components/ui/tabs";
</script>

<div
  class="z-[-1] top-0 left-0 absolute overflow-clip w-full h-full bg-pills-pink"
>
  <div
    class="w-full h-full halftone md:top-[40] halftone--size-sm md:halftone--mask-fade-y halftone--mask-fade-radial absolute top-[-10] md:left-40 left-0 rotate-12 halftone--pattern-angled halftone--blend-multiply"
  ></div>
</div>
<div
  class=" w-full
   flex flex-col items-center"
>
  <!-- Featured Post -->
  <div class="h-fit">
    <FeaturedPost
      id={featuredPost.id}
      title={featuredPost.title}
      description={featuredPost.description}
      author={featuredPost.author}
      date={featuredPost.date}
      categories={featuredPost.categories}
      imageUrl={featuredPost.imageUrl}
    />
  </div>

  <!-- Post Categories -->
  <div class="mb-16 mt-8 relative">
    <Tabs value="recent">
      <div class="mb-8 md:px-0 px-4 mx-auto">
        <div class="text-center relative">
          <!-- Comic-style background for the heading -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="h-1 w-full bg-black"></div>
          </div>

          <h2
            class="relative inline-block px-8 py-2 text-pills-pink font-comic text-3xl bg-black transform -rotate-1"
          >
            LATEST ARTICLES
          </h2>
        </div>
        <TabsList class="mt-2">
          <TabsTrigger
            value="recent"
            class="data-[state=active]:bg-black  data-[state=active]:text-pills-pink  data-[state=inactive]:text-black data-[state=inactive]:bg-pills-pink transition-all rounded-r-none rouned-2-xl"
          >
            Recent
          </TabsTrigger>
          <TabsTrigger
            value="popular"
            class="data-[state=active]:bg-black  data-[state=active]:text-pills-pink  data-[state=inactive]:text-black data-[state=inactive]:bg-pills-pink transition-all rounded-l-none rouned-2-xl"
          >
            Popular
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent class="px-4" value="recent">
        <PostList posts={recentPosts} />
      </TabsContent>

      <TabsContent class="px-4" value="popular">
        <PostList posts={[...recentPosts].sort(() => 0.5 - Math.random())} />
      </TabsContent>
    </Tabs>
  </div>

  <!-- CTA -->
  <div class="text-center w-full relative bg-purple-50 p-8 md:p-12">
    <div class="absolute top-0 left-0 right-0 half-tone"></div>
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
      "I need a doctor!"
    </h2>
    <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Need some advice</p>
    <Button
      href="/submit"
      class="bg-purple-700 hover:bg-purple-800 text-white font-medium px-6"
    >
      Submit your request
    </Button>
  </div>
</div>
