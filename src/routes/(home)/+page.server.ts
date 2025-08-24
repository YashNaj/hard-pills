import { db } from "../../db/index.js";
import { posts, postImages } from "../../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  try {
    // Fetch featured post
    const featuredResult = await db
      .select({
        post: posts,
        headerImage: postImages,
      })
      .from(posts)
      .leftJoin(postImages, eq(posts.headerImageId, postImages.id))
      .where(and(eq(posts.status, "published"), eq(posts.featured, true)))
      .orderBy(desc(posts.createdAt))
      .limit(1);

    // Fetch recent posts (non-featured)
    const recentResult = await db
      .select({
        post: posts,
        headerImage: postImages,
      })
      .from(posts)
      .leftJoin(postImages, eq(posts.headerImageId, postImages.id))
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.createdAt))
      .limit(6);

    // Transform the data to match component expectations
    const featuredPost = featuredResult[0]
      ? {
        ...featuredResult[0].post,
        imageUrl:
          featuredResult[0].headerImage?.largePath ||
          featuredResult[0].headerImage?.originalPath ||
          null,
        date: featuredResult[0].post.createdAt,
        categories: [], // Categories would need to be handled differently
        description: "", // Would need to extract from content or add to schema
        author: "Author", // Author is UUID, would need to join with users table
      }
      : null;

    const recentPosts = recentResult.map(({ post, headerImage }) => ({
      ...post,
      imageUrl: headerImage?.largePath || headerImage?.originalPath || null,
      date: post.createdAt,
      categories: [], // Categories would need to be handled differently
      description: "", // Would need to extract from content or add to schema
      author: "Author", // Author is UUID, would need to join with users table
    }));

    return {
      featuredPost,
      recentPosts,
    };
  } catch (err) {
    console.error("Database error:", err);
    // Fallback to empty data
    return {
      featuredPost: null,
      recentPosts: [],
    };
  }
};
