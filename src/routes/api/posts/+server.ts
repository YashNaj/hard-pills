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
	try {
		const postId = url.searchParams.get('id');
		
		if (postId) {
			const post = await getPost(postId);
			if (!post) {
				return json({ error: 'Post not found' }, { status: 404 });
			}
			return json({ post });
		}
		
		// If no ID provided, return all posts (could add pagination later)
		const posts = await getAllPosts();
		console.log('API: Found posts:', posts.length);
		return json({ posts });
	} catch (error) {
		console.error('Error fetching posts:', error);
		return json({ error: 'Failed to fetch posts' }, { status: 500 });
	}
};