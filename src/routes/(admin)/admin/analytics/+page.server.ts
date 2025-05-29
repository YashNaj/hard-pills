import { db } from '../../../../db/index.js';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Get post analytics
		const postStats = await db.execute(sql`
			SELECT 
				COUNT(*) as total_posts,
				COUNT(CASE WHEN status = 'published' THEN 1 END) as published_posts,
				COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_posts,
				COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as posts_this_month,
				COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as posts_this_week
			FROM posts
		`);
		
		// Get submission analytics
		const submissionStats = await db.execute(sql`
			SELECT 
				COUNT(*) as total_submissions,
				COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_submissions,
				COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_submissions,
				COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as submissions_this_month
			FROM submissions
		`);
		
		// Get mailing list stats
		const mailingStats = await db.execute(sql`
			SELECT 
				COUNT(*) as total_subscribers,
				COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_subscribers_this_month
			FROM mailing_list
		`);
		
		// Get recent activity (posts by day for last 30 days)
		const recentActivity = await db.execute(sql`
			SELECT 
				DATE(created_at) as date,
				COUNT(*) as count,
				'posts' as type
			FROM posts 
			WHERE created_at >= NOW() - INTERVAL '30 days'
			GROUP BY DATE(created_at)
			UNION ALL
			SELECT 
				DATE(created_at) as date,
				COUNT(*) as count,
				'submissions' as type
			FROM submissions 
			WHERE created_at >= NOW() - INTERVAL '30 days'
			GROUP BY DATE(created_at)
			ORDER BY date DESC
		`);
		
		// Get top performing posts (mock data for now)
		const topPosts = await db.execute(sql`
			SELECT 
				id,
				title,
				slug,
				status,
				created_at,
				featured
			FROM posts 
			WHERE status = 'published'
			ORDER BY created_at DESC
			LIMIT 10
		`);
		
		return {
			stats: {
				posts: postStats.rows[0] || {},
				submissions: submissionStats.rows[0] || {},
				mailing: mailingStats.rows[0] || {}
			},
			activity: recentActivity.rows || [],
			topPosts: topPosts.rows || []
		};
	} catch (error) {
		console.error('Failed to load analytics:', error);
		return {
			stats: {
				posts: {},
				submissions: {},
				mailing: {}
			},
			activity: [],
			topPosts: []
		};
	}
};