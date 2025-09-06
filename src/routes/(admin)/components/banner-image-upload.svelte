<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { ImagePlus, X, Upload, AlertCircle } from 'lucide-svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { v4 as uuidv4 } from 'uuid';

	let {
		supabase,
		postId,
		currentImageId = $bindable(),
		currentImageUrl = $bindable(),
		onImageChange = (imageId: string | null, imageUrl: string | null) => {}
	}: {
		supabase: SupabaseClient;
		postId: string;
		currentImageId?: string | null;
		currentImageUrl?: string | null;
		onImageChange?: (imageId: string | null, imageUrl: string | null) => void;
	} = $props();

	let isUploading = $state(false);
	let uploadError = $state<string | null>(null);
	let dragActive = $state(false);
	let fileInputElement: HTMLInputElement;

	async function uploadBannerImage(file: File): Promise<{ imageId: string | null; imageUrl: string | null }> {
		// Debug: Check what supabase client we received
		console.log('BannerImageUpload received supabase client:', supabase);
		console.log('Supabase client type:', typeof supabase);
		console.log('Has supabase.auth?', !!supabase?.auth);
		console.log('Has supabase.storage?', !!supabase?.storage);
		
		if (!supabase) {
			throw new Error('No Supabase client provided to BannerImageUpload component');
		}
		
		// Check current user
		const { data: currentUser, error: userError } = await supabase.auth.getUser();
		console.log('Current authenticated user:', currentUser?.user?.id);
		console.log('User auth error:', userError);
		
		if (!file.type.startsWith('image/')) {
			throw new Error('Please select an image file');
		}

		const fileExt = file.name.split('.').pop();
		const uniqueFileName = `${uuidv4()}.${fileExt}`;
		const filePath = `banners/${uniqueFileName}`;

		// Upload to Supabase storage - using post_images_original bucket
		console.log('Uploading banner image to storage:', {
			bucket: 'post_images_original',
			filePath: filePath,
			fileSize: file.size,
			fileType: file.type
		});
		
		const { data: uploadData, error: uploadError } = await supabase.storage
			.from('post_images_original')
			.upload(filePath, file);

		if (uploadError) {
			console.error('Storage upload error:', uploadError);
			throw uploadError;
		}
		
		console.log('Storage upload successful:', uploadData);

		// Get public URL
		const { data: urlData } = supabase.storage
			.from('post_images_original')
			.getPublicUrl(filePath);

		if (!urlData?.publicUrl) {
			throw new Error('Failed to get public URL');
		}

		// Create image dimensions (basic implementation - in production you'd get actual dimensions)
		const imageWidth = 1200; // Default banner width
		const imageHeight = 600; // Default banner height

		// Create post_images record - Enhanced UUID debugging
		console.log('=== BANNER IMAGE UPLOAD UUID DEBUGGING ===');
		console.log('- Original postId:', `"${postId}"`);
		console.log('- postId JSON:', JSON.stringify(postId));
		console.log('- postId type:', typeof postId);
		console.log('- postId length:', postId.length);
		console.log('- Expected UUID length: 36');
		console.log('- Contains \\r?', postId.includes('\r'));
		console.log('- Contains \\n?', postId.includes('\n'));
		console.log('- Contains tab?', postId.includes('\t'));
		console.log('- First 10 chars:', JSON.stringify(postId.slice(0, 10)));
		console.log('- Last 10 chars:', JSON.stringify(postId.slice(-10)));
		console.log('- All char codes:', Array.from(postId).map((char, i) => `${i}: '${char}' (${char.charCodeAt(0)})`));
		console.log('- After trim():', `"${postId.trim()}"`);
		console.log('- After trim() length:', postId.trim().length);
		console.log('=========================================');
		
		const { data: imageRecord, error: dbError } = await supabase
			.from('post_images')
			.insert({
				post_id: postId.trim(),
				original_filename: file.name,
				alt_text: `Banner image for post`,
				display_order: -1, // Banner images get negative order
				mime_type: file.type,
				original_path: filePath,
				original_width: imageWidth,
				original_height: imageHeight,
				original_size: file.size
			})
			.select('id')
			.single();

		if (dbError) {
			console.error('Database error creating post_images record:', dbError);
			console.error('Full error details:', {
				message: dbError.message,
				details: dbError.details,
				hint: dbError.hint,
				code: dbError.code
			});
			// Clean up uploaded file if DB insert fails
			await supabase.storage.from('post_images_original').remove([filePath]);
			throw dbError;
		}

		console.log('Successfully created post_images record:', imageRecord);
		
		// Debug the imageId that will be used for posts table update
		console.log('=== IMAGE ID DEBUGGING ===');
		console.log('- imageRecord.id:', `"${imageRecord.id}"`);
		console.log('- imageRecord.id JSON:', JSON.stringify(imageRecord.id));
		console.log('- imageRecord.id type:', typeof imageRecord.id);
		console.log('- imageRecord.id length:', imageRecord.id.length);
		console.log('- Contains \\r?', imageRecord.id.includes('\r'));
		console.log('- Contains \\n?', imageRecord.id.includes('\n'));
		console.log('- Last 5 chars:', JSON.stringify(imageRecord.id.slice(-5)));
		console.log('- All char codes:', Array.from(imageRecord.id).map((char, i) => `${i}: '${char}' (${char.charCodeAt(0)})`));
		console.log('========================');
		
		return {
			imageId: imageRecord.id,
			imageUrl: urlData.publicUrl
		};
	}

	async function handleFileUpload(file: File) {
		isUploading = true;
		uploadError = null;

		try {
			// Remove old banner if exists
			if (currentImageId) {
				await removeBannerImage();
			}

			const { imageId, imageUrl } = await uploadBannerImage(file);
			
			// Debug the imageId before using it in posts table update
			console.log('=== POSTS TABLE UPDATE DEBUGGING ===');
			console.log('- imageId to be used:', `"${imageId}"`);
			console.log('- imageId JSON:', JSON.stringify(imageId));
			console.log('- imageId type:', typeof imageId);
			console.log('- imageId length:', imageId?.length);
			console.log('- postId to match:', `"${postId.trim()}"`);
			
			// Check current post data before update
			const { data: currentPost, error: fetchError } = await supabase
				.from('posts')
				.select('header_image_id')
				.eq('id', postId.trim())
				.single();
				
			if (fetchError) {
				console.error('Error fetching current post:', fetchError);
			} else {
				console.log('- Current header_image_id:', `"${currentPost?.header_image_id}"`);
				console.log('- Current header_image_id JSON:', JSON.stringify(currentPost?.header_image_id));
			}
			console.log('=====================================');
			
			// Update post with new header image ID
			const { error: postUpdateError } = await supabase
				.from('posts')
				.update({ header_image_id: imageId })
				.eq('id', postId.trim());

			if (postUpdateError) {
				console.error('=== POST UPDATE ERROR DETAILS ===');
				console.error('Error code:', postUpdateError.code);
				console.error('Error message:', postUpdateError.message);
				console.error('Error details:', postUpdateError.details);
				console.error('Error hint:', postUpdateError.hint);
				console.error('Full error object:', postUpdateError);
				console.error('Values being used:');
				console.error('  - header_image_id:', `"${imageId}"`);
				console.error('  - posts.id WHERE clause:', `"${postId.trim()}"`);
				console.error('=================================');
				throw postUpdateError;
			}

			currentImageId = imageId;
			currentImageUrl = imageUrl;
			onImageChange(imageId, imageUrl);
		} catch (error: any) {
			console.error('Banner upload error:', error);
			uploadError = error.message || 'Failed to upload banner image';
		} finally {
			isUploading = false;
		}
	}

	async function removeBannerImage() {
		if (!currentImageId) return;

		try {
			// Get image record to find file path
			const { data: imageRecord, error: fetchError } = await supabase
				.from('post_images')
				.select('original_path')
				.eq('id', currentImageId)
				.single();

			if (fetchError) throw fetchError;

			// Remove from storage
			if (imageRecord.original_path) {
				await supabase.storage
					.from('post_images_original')
					.remove([imageRecord.original_path]);
			}

			// Remove from database
			const { error: deleteError } = await supabase
				.from('post_images')
				.delete()
				.eq('id', currentImageId);

			if (deleteError) throw deleteError;

			// Update post to remove header image reference
			const { error: postUpdateError } = await supabase
				.from('posts')
				.update({ header_image_id: null })
				.eq('id', postId.trim());

			if (postUpdateError) throw postUpdateError;

			currentImageId = null;
			currentImageUrl = null;
			onImageChange(null, null);
		} catch (error: any) {
			console.error('Banner removal error:', error);
			uploadError = error.message || 'Failed to remove banner image';
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragActive = false;
		
		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			handleFileUpload(files[0]);
		}
	}

	function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = input.files;
		if (files && files.length > 0) {
			handleFileUpload(files[0]);
		}
		// Reset input
		input.value = '';
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragActive = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		dragActive = false;
	}
</script>

<Card class="w-full">
	<CardHeader>
		<CardTitle class="text-sm font-medium flex items-center gap-2">
			<ImagePlus class="w-4 h-4" />
			Banner Image
		</CardTitle>
	</CardHeader>
	<CardContent class="space-y-4">
		{#if currentImageUrl}
			<!-- Current Banner Preview -->
			<div class="relative rounded-lg overflow-hidden border border-border">
				<img
					src={currentImageUrl}
					alt="Current banner"
					class="w-full h-32 object-cover"
				/>
				<div class="absolute top-2 right-2">
					<Button
						variant="destructive"
						size="sm"
						onclick={removeBannerImage}
						disabled={isUploading}
						class="h-8 w-8 p-0"
						aria-label="Remove banner"
					>
						<X class="w-4 h-4" />
					</Button>
				</div>
			</div>
		{:else}
			<!-- Upload Zone -->
			<div
				class={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
					dragActive 
						? 'border-primary bg-primary/5' 
						: 'border-border hover:border-primary/50'
				} ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
				ondrop={handleDrop}
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
			>
				<div class="flex flex-col items-center gap-4">
					<div class="p-4 rounded-full bg-muted">
						{#if isUploading}
							<Upload class="w-6 h-6 animate-pulse" />
						{:else}
							<ImagePlus class="w-6 h-6" />
						{/if}
					</div>
					
					<div class="space-y-2">
						<p class="text-sm font-medium">
							{isUploading ? 'Uploading banner...' : 'Upload banner image'}
						</p>
						<p class="text-xs text-muted-foreground">
							Drag and drop an image here, or click to browse
						</p>
						<p class="text-xs text-muted-foreground">
							Recommended: 1200×600px, JPG or PNG
						</p>
					</div>

					<Button
						variant="outline"
						size="sm"
						onclick={() => fileInputElement.click()}
						disabled={isUploading}
					>
						{isUploading ? 'Uploading...' : 'Browse Files'}
					</Button>
				</div>
			</div>
		{/if}

		<!-- Hidden file input -->
		<input
			type="file"
			bind:this={fileInputElement}
			accept="image/*"
			class="hidden"
			onchange={handleFileInput}
		/>

		<!-- Error display -->
		{#if uploadError}
			<div class="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
				<AlertCircle class="w-4 h-4 shrink-0" />
				<span>{uploadError}</span>
			</div>
		{/if}
	</CardContent>
</Card>
