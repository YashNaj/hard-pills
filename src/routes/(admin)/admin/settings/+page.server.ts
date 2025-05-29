import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// For now, return mock settings data
	// In a real app, this would load from a settings table or config
	
	return {
		settings: {
			site: {
				title: 'Hard Pills',
				description: 'A blog about hard truths and difficult pills to swallow',
				url: 'https://hardpills.com',
				timezone: 'UTC'
			},
			email: {
				fromName: 'Hard Pills',
				fromEmail: 'noreply@hardpills.com',
				replyTo: 'hello@hardpills.com'
			},
			content: {
				postsPerPage: 10,
				excerptLength: 150,
				commentsEnabled: false,
				moderateComments: true
			},
			security: {
				requireAuth: true,
				allowRegistration: false,
				sessionTimeout: 30
			}
		}
	};
};