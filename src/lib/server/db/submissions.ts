import { db } from "./index";
import { submissions } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";

export interface CreateSubmissionData {
	name?: string;
	email?: string;
	subject?: string;
	content: string;
	ipAddress?: string;
}

export interface UpdateSubmissionData {
	status?: string;
}

export async function createSubmission(data: CreateSubmissionData) {
	const [submission] = await db
		.insert(submissions)
		.values({
			...data,
			status: "pending",
		})
		.returning();

	return submission;
}

export async function updateSubmission(id: string, data: UpdateSubmissionData) {
	const [submission] = await db
		.update(submissions)
		.set(data)
		.where(eq(submissions.id, id))
		.returning();

	return submission;
}

export async function getSubmission(id: string) {
	const [submission] = await db
		.select()
		.from(submissions)
		.where(eq(submissions.id, id));

	return submission;
}

export async function deleteSubmission(id: string) {
	await db.delete(submissions).where(eq(submissions.id, id));
}

export async function getAllSubmissions() {
	return db.select().from(submissions).orderBy(submissions.createdAt);
}

export async function getPendingSubmissions() {
	return db
		.select()
		.from(submissions)
		.where(eq(submissions.status, "pending"))
		.orderBy(submissions.createdAt);
}
