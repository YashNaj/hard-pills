// src/routes/post/[id]/+page.server.ts

import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getPostById } from "$lib/data/posts"; // Uses the function from your file

export const load: PageServerLoad = ({ params }) => {
  const postId = params.id;
  const post = getPostById(postId); // Fetches using your function

  if (!post) {
    error(404, {
      message: `Post with ID '${postId}' not found`,
    });
  }

  // Return the found post, ensuring content has a fallback
  return {
    post: {
      ...post,
      content: post.content ?? "<p>This post has no content yet.</p>",
    },
  };
};
