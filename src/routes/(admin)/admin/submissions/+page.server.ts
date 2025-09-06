import { getAllSubmissions } from '$lib/server/db/submissions.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	console.log('📋 [PAGE] /admin/submissions - Loading submissions page...');

	try {
		console.log('📋 [PAGE] Calling getAllSubmissions()...');
		const submissions = await getAllSubmissions();
		console.log('📋 [PAGE] getAllSubmissions() returned:', submissions?.length || 0, 'submissions');

		if (!submissions || submissions.length === 0) {
			console.log('⚠️ [PAGE] WARNING: No submissions returned from getAllSubmissions()');
		} else {
			console.log('📋 [PAGE] Submissions summary:', submissions.map(s => ({
				id: s.id?.slice(0, 8) + '...',
				name: s.name || 'Anonymous',
				subject: s.subject || 'No subject',
				status: s.status
			})));
		}

		const meta = {
			total: submissions?.length || 0,
			pending: submissions?.filter(s => s.status === 'pending').length || 0,
			approved: submissions?.filter(s => s.status === 'approved').length || 0,
			rejected: submissions?.filter(s => s.status === 'rejected').length || 0,
			converted: submissions?.filter(s => s.status === 'converted').length || 0
		};

		console.log('📋 [PAGE] Meta stats:', meta);

		return {
			submissions: submissions || [],
			meta
		};
	} catch (error) {
		console.error('🚨 [PAGE] Failed to load submissions:', error);
		console.error('🚨 [PAGE] Error details:', error.message);
		console.error('🚨 [PAGE] Error stack:', error.stack);
		return {
			submissions: [],
			meta: { total: 0, pending: 0, approved: 0, rejected: 0, converted: 0 }
		};
	}
};
