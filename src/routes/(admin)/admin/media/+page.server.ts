import { db } from '$lib/server/db';
import { postImages } from '../../../../../drizzle/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Get all images with post information
		const images = await db.execute(sql`
			SELECT 
				pi.*,
				p.title as post_title,
				p.slug as post_slug
			FROM post_images pi
			LEFT JOIN posts p ON pi.post_id = p.id
			ORDER BY pi.created_at DESC
			LIMIT 100
		`);
		
		// Get storage stats
		const stats = await db.execute(sql`
			SELECT 
				COUNT(*) as total_images,
				SUM(COALESCE(original_size, 0)) as total_size,
				COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_uploads
			FROM post_images
		`);
		
		return {
			images: images.rows || [],
			stats: stats.rows[0] || { total_images: 0, total_size: 0, recent_uploads: 0 }
		};
	} catch (error) {
		console.error('Failed to load media:', error);
		return {
			images: [],
			stats: { total_images: 0, total_size: 0, recent_uploads: 0 }
		};
	}
};