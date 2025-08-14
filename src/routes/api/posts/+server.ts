import { json } from '@sveltejs/kit';
import { updatePost, createPost, getPost, getAllPosts } from '$lib/server/db/posts.js';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		const { id, ...updateData } = data;
		
		if (!id) {
			return json({ error: 'Post ID is required' }, { status: 400 });
		}
		
		const updatedPost = await updatePost(id, updateData);
		
		if (!updatedPost) {
			return json({ error: 'Post not found' }, { status: 404 });
		}
		
		return json({ post: updatedPost });
	} catch (error) {
		console.error('Error updating post:', error);
		return json({ error: 'Failed to update post' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		
		if (!data.title || !data.content || !data.slug || !data.author) {
			return json({ error: 'Title, content, slug, and author are required' }, { status: 400 });
		}
		
		const newPost = await createPost(data);
		
		return json({ post: newPost }, { status: 201 });
	} catch (error) {
		console.error('Error creating post:', error);
		return json({ error: 'Failed to create post' }, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ url }) => {
	console.log('🌐 [API] GET /api/posts - Request received');
	console.log('🌐 [API] URL searchParams:', url.searchParams.toString());
	
	try {
		const postId = url.searchParams.get('id');
		console.log('🌐 [API] Requested post ID:', postId);
		
		if (postId) {
			console.log(`🌐 [API] Fetching single post with ID: ${postId}`);
			const post = await getPost(postId);
			if (!post) {
				console.log('🌐 [API] Post not found for ID:', postId);
				return json({ error: 'Post not found' }, { status: 404 });
			}
			console.log('🌐 [API] Single post fetched successfully:', { id: post.id?.slice(0, 8) + '...', title: post.title });
			return json({ post });
		}
		
		// If no ID provided, return all posts (could add pagination later)
		console.log('🌐 [API] Fetching all posts...');
		const posts = await getAllPosts();
		console.log('🌐 [API] All posts fetched. Count:', posts.length);
		
		if (posts.length === 0) {
			console.log('⚠️ [API] WARNING: No posts found in database');
		}
		
		return json({ posts });
	} catch (error) {
		console.error('🚨 [API] Error fetching posts:', error);
		return json({ error: 'Failed to fetch posts' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ url }) => {
	try {
		const postId = url.searchParams.get('id');
		
		if (!postId) {
			return json({ error: 'Post ID is required' }, { status: 400 });
		}
		
		// TODO: Implement deletePost function in posts.ts
		// const success = await deletePost(postId);
		
		// if (!success) {
		// 	return json({ error: 'Post not found' }, { status: 404 });
		// }
		
		return json({ success: true });
	} catch (error) {
		console.error('Error deleting post:', error);
		return json({ error: 'Failed to delete post' }, { status: 500 });
	}
};