import { faker } from '@faker-js/faker';

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
		ipAddress: faker.internet.ip(),
		status: faker.helpers.arrayElement(['pending', 'reviewed', 'published', 'rejected']),
		createdAt: faker.date.between({
			from: new Date('2024-01-01'),
			to: new Date()
		}).toISOString()
	};
};

function generateSubmissions(count: number = 50) {
	console.log(`🎲 Generating ${count} random submissions...`);
	
	const submissions_data = [];
	
	for (let i = 0; i < count; i++) {
		submissions_data.push(generateRandomSubmission());
	}
	
	console.log('📝 Sample submission:');
	console.log(submissions_data[0]);
	
	// Generate SQL INSERT statements
	console.log('\n💾 Generated SQL INSERT statements:\n');
	console.log('-- Insert random submissions into the database');
	console.log('-- Run this in your database client or pgAdmin\n');
	
	const sqlStatements = submissions_data.map(sub => {
		const escapedName = sub.name.replace(/'/g, "''");
		const escapedEmail = sub.email.replace(/'/g, "''");
		const escapedSubject = sub.subject.replace(/'/g, "''");
		const escapedContent = sub.content.replace(/'/g, "''");
		
		return `INSERT INTO submissions (name, email, subject, content, status, created_at) 
VALUES ('${escapedName}', '${escapedEmail}', '${escapedSubject}', '${escapedContent}', '${sub.status}', '${sub.createdAt}');`;
	});
	
	console.log(sqlStatements.join('\n\n'));
	
	// Show some statistics
	const statusCounts = submissions_data.reduce((acc, sub) => {
		acc[sub.status] = (acc[sub.status] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);
	
	console.log('\n\n📊 Status distribution:', statusCounts);
	console.log(`\n✅ Generated ${count} SQL INSERT statements!`);
	console.log(`\nCopy the SQL statements above and run them in your database client.`);
}

// Run if called directly
if (import.meta.main) {
	const count = process.argv[2] ? parseInt(process.argv[2]) : 25;
	generateSubmissions(count);
}

export { generateSubmissions };