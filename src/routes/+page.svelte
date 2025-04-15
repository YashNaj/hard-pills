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
  class=" w-full
   flex flex-col items-center"
>
  <!-- Featured Post -->
  <div class="mb-16">
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
  <div class="mb-16 md:px-0 px-4">
    <Tabs value="recent" class="w-full">
      <div class="flex justify-between items-center mb-8">
        <div class="text-center relative">
          <!-- Comic-style background for the heading -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="h-1 w-full bg-purple-300/50"></div>
          </div>

          <h2
            class="relative inline-block px-8 py-2 bg-purple-100 font-comic text-3xl text-purple-900 transform -rotate-1"
          >
            LATEST ARTICLES
          </h2>
        </div>
        <TabsList>
          <TabsTrigger
            value="recent"
            class="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900"
          >
            Recent
          </TabsTrigger>
          <TabsTrigger
            value="popular"
            class="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900"
          >
            Popular
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="recent">
        <PostList posts={recentPosts} />
      </TabsContent>

      <TabsContent value="popular">
        <!-- For demo, we're using the same posts but would be different in production -->
        <PostList posts={[...recentPosts].sort(() => 0.5 - Math.random())} />
      </TabsContent>
    </Tabs>
  </div>

  <!-- CTA -->
  <div class="text-center bg-purple-50 rounded-xl p-8 md:p-12">
    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
      Have a hard pill to share?
    </h2>
    <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
      Submit your own perspective and join our community of truth-seekers.
    </p>
    <Button
      href="/submit"
      class="bg-purple-700 hover:bg-purple-800 text-white font-medium px-6"
    >
      Submit an Article
    </Button>
  </div>
</div>
