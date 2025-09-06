import { getAllSubmissions } from '$lib/server/db/submissions.js';
import { getAllPosts } from '$lib/server/db/posts.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	console.log('🏠 [PAGE] /admin - Loading admin dashboard...');

	try {
		// Load both submissions and recent posts for the dashboard
		console.log('🏠 [PAGE] Loading submissions and posts...');
		const [submissions, posts] = await Promise.all([
			getAllSubmissions(),
			getAllPosts()
		]);

		console.log('🏠 [PAGE] Loaded:', submissions?.length || 0, 'submissions,', posts?.length || 0, 'posts');

		// Get recent submissions (last 10)
		const recentSubmissions = submissions?.slice(0, 10) || [];

		return {
			submissions: recentSubmissions,
			posts: posts?.slice(0, 5) || [], // Recent 5 posts for dashboard
			meta: {
				totalSubmissions: submissions?.length || 0,
				pendingSubmissions: submissions?.filter(s => s.status === 'pending').length || 0,
				totalPosts: posts?.length || 0,
				publishedPosts: posts?.filter(p => p.status === 'published').length || 0
			}
		};
	} catch (error) {
		console.error('🚨 [PAGE] Failed to load admin dashboard data:', error);
		return {
			submissions: [],
			posts: [],
			meta: {
				totalSubmissions: 0,
				pendingSubmissions: 0,
				totalPosts: 0,
				publishedPosts: 0
			}
		};
	}
};