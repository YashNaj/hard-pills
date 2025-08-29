import { db } from "./index";
import { posts } from "../../../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import type { User } from "@supabase/supabase-js";

export interface CreatePostData {
	title: string;
	content: string;
	slug: string;
	author: string;
	status?: "draft" | "scheduled" | "published" | "archived";
	scheduledAt?: Date;
	featured?: boolean;
}

export interface UpdatePostData {
	title?: string;
	content?: string;
	slug?: string;
	status?: "draft" | "scheduled" | "published" | "archived";
	scheduledAt?: Date;
	featured?: boolean;
}

export async function createPost(data: CreatePostData) {
	try {
		const [post] = await db
			.insert(posts)
			.values({
				...data,
				status: data.status || "draft",
				featured: data.featured || false,
			})
			.returning();

		return post;
	} catch (error: any) {
		// For testing: if it's a foreign key constraint error, log but provide helpful message
		if (
			error.code === "23503" &&
			error.constraint_name === "posts_author_fkey"
		) {
			console.error("Author UUID not found in auth.users table:", data.author);
			throw new Error(
				`Author ID ${data.author} does not exist in the users table. Please use a valid user ID.`,
			);
		}
		throw error;
	}
}

export async function updatePost(id: string, data: UpdatePostData) {
	const [post] = await db
		.update(posts)
		.set({
			...data,
			updatedAt: new Date().toISOString(),
		})
		.where(eq(posts.id, id))
		.returning();

	return post;
}

export async function getPost(id: string) {
	const [post] = await db.select().from(posts).where(eq(posts.id, id));

	return post;
}

export async function deletePost(id: string) {
	await db.delete(posts).where(eq(posts.id, id));
}

export async function getAllPosts() {
	console.log("📚 [DB] getAllPosts: Starting to fetch all posts...");
	try {
		const result = await db.select().from(posts).orderBy(desc(posts.createdAt));
		console.log(
			`📚 [DB] getAllPosts: Successfully fetched ${result.length} posts`,
		);
		console.log(
			"📚 [DB] getAllPosts: Posts data:",
			result.map((p) => ({
				id: p.id?.slice(0, 8) + "...",
				title: p.title,
				status: p.status,
				createdAt: p.createdAt,
			})),
		);
		return result;
	} catch (error) {
		console.error("📚 [DB] getAllPosts: Database error:", error);
		throw error;
	}
}

export async function getPublishedPosts() {
	return db.select().from(posts).where(eq(posts.status, "published"));
}
