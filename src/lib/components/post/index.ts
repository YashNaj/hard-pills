// Export all post-related components
export { default as PostCard } from "./post-card.svelte";
export { default as FeaturedPost } from "./post-featured.svelte";
export { default as PostList } from "./post-list.svelte";

// Re-export post data types and samples
export type { Post } from "$lib/data/posts";
export { featuredPost, recentPosts, popularPosts } from "$lib/data/posts";
