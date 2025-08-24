import { redirect } from "@sveltejs/kit";
import { getPost } from "$lib/server/db/posts.js";
import { getSubmission } from "$lib/server/db/submissions.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params, url }) => {
	if (!params.id) {
		throw redirect(302, "/admin");
	}

	try {
		const post = await getPost(params.id);

		// Handle new post creation with submission
		const submissionId = url.searchParams.get("submission");
		let relatedSubmission = null;

		if (post?.submissionId) {
			// Load related submission for existing post
			try {
				relatedSubmission = await getSubmission(post.submissionId);
			} catch (error) {
				console.error("Error loading related submission:", error);
			}
		} else if (submissionId) {
			// Load submission for new post creation
			try {
				relatedSubmission = await getSubmission(submissionId);
			} catch (error) {
				console.error("Error loading submission for new post:", error);
			}
		}

		return {
			post,
			relatedSubmission,
			submissionId, // Pass the URL param for new posts
		};
	} catch (error) {
		console.error("Error loading post:", error);
		throw redirect(302, "/admin");
	}
};
