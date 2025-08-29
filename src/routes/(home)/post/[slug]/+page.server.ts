// src/routes/post/[slug]/+page.server.ts

import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import { posts, postImages } from '../../../../../drizzle/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
  const postSlug = params.slug;

  try {
    // Fetch post by slug with header image
    const result = await db
      .select({
        post: posts,
        headerImage: postImages
      })
      .from(posts)
      .leftJoin(postImages, eq(posts.headerImageId, postImages.id))
      .where(
        and(
          eq(posts.slug, postSlug),
          eq(posts.status, 'published')
        )
      )
      .limit(1);

    if (!result || result.length === 0) {
      error(404, {
        message: `Post with slug '${postSlug}' not found`,
      });
    }

    const { post, headerImage } = result[0];

    // Return the found post with header image URL
    return {
      post: {
        ...post,
        content: post.content ?? "<p>This post has no content yet.</p>",
        imageUrl: headerImage?.largePath || headerImage?.originalPath || null,
      },
    };
  } catch (err) {
    console.error('Database error:', err);
    error(500, {
      message: 'Failed to load post',
    });
  }
};
