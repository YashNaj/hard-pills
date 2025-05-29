import { getAllSubmissions } from '$lib/server/db/submissions.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const submissions = await getAllSubmissions();
		
		return {
			submissions: submissions || [],
			meta: {
				total: submissions?.length || 0,
				pending: submissions?.filter(s => s.status === 'pending').length || 0,
				approved: submissions?.filter(s => s.status === 'approved').length || 0,
				rejected: submissions?.filter(s => s.status === 'rejected').length || 0,
				converted: submissions?.filter(s => s.status === 'converted').length || 0
			}
		};
	} catch (error) {
		console.error('Failed to load submissions:', error);
		return {
			submissions: [],
			meta: { total: 0, pending: 0, approved: 0, rejected: 0, converted: 0 }
		};
	}
};