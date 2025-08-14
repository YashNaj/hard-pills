import { getAllPosts } from "$lib/server/db/posts.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	console.log('📄 [PAGE] /admin/posts - Loading posts page...');

	try {
		console.log('📄 [PAGE] Calling getAllPosts()...');
		const posts = await getAllPosts();
		console.log('📄 [PAGE] getAllPosts() returned:', posts?.length || 0, 'posts');

		if (!posts || posts.length === 0) {
			console.log('⚠️ [PAGE] WARNING: No posts returned from getAllPosts()');
		} else {
			console.log('📄 [PAGE] Posts summary:', posts.map(p => ({
				id: p.id?.slice(0, 8) + '...',
				title: p.title,
				status: p.status
			})));
		}

		const meta = {
			total: posts?.length || 0,
			published: posts?.filter((p) => p.status === "published").length || 0,
			draft: posts?.filter((p) => p.status === "draft").length || 0,
			scheduled: posts?.filter((p) => p.status === "scheduled").length || 0,
		};

		console.log('📄 [PAGE] Meta stats:', meta);

		return {
			posts: posts || [],
			meta,
		};
	} catch (error) {
		console.error("🚨 [PAGE] Failed to load posts:", error);
		return {
			posts: [],
			meta: { total: 0, published: 0, draft: 0, scheduled: 0 },
		};
	}
};
