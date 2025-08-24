// Export all home route components
export { default as PostCard } from "./post-card.svelte";
export { default as FeaturedPost } from "./post-featured.svelte";
export { default as PostList } from "./post-list.svelte";
export { default as ArticlePost } from "./article-post.svelte";

// Re-export post data types and samples (if still needed)
// TODO: Remove this once we fully migrate to database posts
// export type { Post } from "$lib/data/posts";
// export { featuredPost, recentPosts, popularPosts } from "$lib/data/posts";
