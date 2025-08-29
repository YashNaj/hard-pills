import { json } from '@sveltejs/kit';
import { faker } from '@faker-js/faker';
import { db } from '$lib/server/db';
import { submissions } from '../../../../drizzle/schema.js';
import type { RequestHandler } from './$types';

// Generate realistic submission content for a "Hard Pills" blog
const generateSubmissionContent = () => {
	const topics = [
		'mental health struggles',
		'career burnout', 
		'relationship issues',
		'anxiety and depression',
		'work-life balance',
		'imposter syndrome',
		'dealing with toxic people',
		'financial stress',
		'family problems',
		'self-esteem issues',
		'social anxiety',
		'addiction recovery',
		'grief and loss',
		'perfectionism',
		'body image issues'
	];
	
	const topic = faker.helpers.arrayElement(topics);
	
	const templates = [
		`I've been struggling with ${topic} for months now and I don't know where to turn. ${faker.lorem.sentences(3)} Can you write about this? I think many people are going through the same thing.`,
		
		`Hi there, I love your blog! Could you please write something about ${topic}? ${faker.lorem.sentences(2)} I feel like this isn't talked about enough.`,
		
		`Your recent posts have been so helpful. I was wondering if you could address ${topic}. ${faker.lorem.sentences(4)} Thank you for all you do.`,
		
		`I've been a long-time reader and your content has helped me so much. Would you consider writing about ${topic}? ${faker.lorem.sentences(3)} I think your perspective would be really valuable.`,
		
		`Hey, I hope you're doing well. I've been dealing with ${topic} and it's been really tough. ${faker.lorem.sentences(5)} Could you maybe write something to help people like me?`
	];
	
	return faker.helpers.arrayElement(templates);
};

const generateSubmissionSubject = () => {
	const subjects = [
		'Blog post request',
		'Topic suggestion', 
		'Please write about this',
		'Content idea',
		'Help with difficult topic',
		'Blog suggestion',
		'Request for advice post',
		'Topic that needs addressing',
		'Content request',
		'Please cover this topic'
	];
	
	return faker.helpers.arrayElement(subjects);
};

const generateRandomSubmission = () => {
	return {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		subject: generateSubmissionSubject(),
		content: generateSubmissionContent(),
		status: faker.helpers.arrayElement(['pending', 'reviewed', 'published', 'rejected']),
		createdAt: faker.date.between({
			from: new Date('2024-01-01'),
			to: new Date()
		}).toISOString()
	};
};

export const POST: RequestHandler = async ({ request }) => {
	const { count = 50 } = await request.json();
	
	try {
		console.log(`🎲 Generating ${count} random submissions...`);
		
		const submissionsData = [];
		
		for (let i = 0; i < count; i++) {
			submissionsData.push(generateRandomSubmission());
		}
		
		console.log('💾 Inserting submissions into database...');
		const result = await db.insert(submissions).values(submissionsData).returning({ 
			id: submissions.id,
			subject: submissions.subject,
			status: submissions.status
		});
		
		// Show some statistics
		const statusCounts = submissionsData.reduce((acc, sub) => {
			acc[sub.status] = (acc[sub.status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);
		
		console.log(`✅ Successfully created ${result.length} submissions!`);
		console.log('📊 Status distribution:', statusCounts);
		
		return json({
			success: true,
			count: result.length,
			statusCounts,
			sampleIds: result.slice(0, 5).map(r => r.id)
		});
		
	} catch (error) {
		console.error('❌ Error creating submissions:', error);
		return json({ 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error' 
		}, { status: 500 });
	}
};