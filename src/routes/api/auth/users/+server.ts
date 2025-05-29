import { json } from '@sveltejs/kit';
import { db } from '../../../../db/index.js';
import { sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		// Get existing users from auth.users table
		const users = await db.execute(sql`SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 10`);
		
		return json({ 
			users: users.rows,
			count: users.rows.length 
		});
	} catch (error) {
		console.error('Error fetching users:', error);
		return json({ error: 'Failed to fetch users', details: error.message }, { status: 500 });
	}
};