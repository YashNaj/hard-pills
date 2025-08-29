import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Get all subscribers
		const subscribers = await db.execute(sql`
			SELECT 
				id,
				email,
				created_at
			FROM mailing_list
			ORDER BY created_at DESC
		`);
		
		// Get subscriber stats
		const stats = await db.execute(sql`
			SELECT 
				COUNT(*) as total_subscribers,
				COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_this_month,
				COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as new_this_week,
				COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 day' THEN 1 END) as new_today
			FROM mailing_list
		`);
		
		// Get growth data (subscribers by month for last 12 months)
		const growthData = await db.execute(sql`
			SELECT 
				DATE_TRUNC('month', created_at) as month,
				COUNT(*) as count
			FROM mailing_list
			WHERE created_at >= NOW() - INTERVAL '12 months'
			GROUP BY DATE_TRUNC('month', created_at)
			ORDER BY month DESC
		`);
		
		return {
			subscribers: subscribers.rows || [],
			stats: stats.rows[0] || { total_subscribers: 0, new_this_month: 0, new_this_week: 0, new_today: 0 },
			growth: growthData.rows || []
		};
	} catch (error) {
		console.error('Failed to load mailing list:', error);
		return {
			subscribers: [],
			stats: { total_subscribers: 0, new_this_month: 0, new_this_week: 0, new_today: 0 },
			growth: []
		};
	}
};