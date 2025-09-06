import { db } from "./index";
import { submissions } from "../../../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

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
	try {
		console.log("🔍 [SUBMISSIONS] Starting getAllSubmissions query...");
		const result = await db.select().from(submissions).orderBy(desc(submissions.createdAt));
		console.log("✅ [SUBMISSIONS] Query successful, found", result.length, "submissions");
		if (result.length > 0) {
			console.log("🔍 [SUBMISSIONS] Sample submission:", {
				id: result[0].id?.slice(0, 8) + '...',
				name: result[0].name,
				subject: result[0].subject,
				status: result[0].status,
				createdAt: result[0].createdAt
			});
		}
		return result;
	} catch (error) {
		console.error("🚫 [SUBMISSIONS] Error in getAllSubmissions:");
		console.error("🚫 [SUBMISSIONS] Error code:", error.code);
		console.error("🚫 [SUBMISSIONS] Error message:", error.message);
		console.error("🚫 [SUBMISSIONS] Full error:", error);
		throw error;
	}
}

export async function getPendingSubmissions() {
	return db
		.select()
		.from(submissions)
		.where(eq(submissions.status, "pending"))
		.orderBy(submissions.createdAt);
}
