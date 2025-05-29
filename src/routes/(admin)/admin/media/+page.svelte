<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { 
		Image as ImageIcon, 
		Upload, 
		Search, 
		Download,
		Trash2,
		Eye,
		HardDrive,
		Calendar,
		FileImage
	} from 'lucide-svelte';
	
	let { data } = $props();
	
	let searchQuery = $state('');
	let selectedImages = $state(new Set());
	let filteredImages = $derived(() => {
		let images = data.images || [];
		
		// Filter by search query
		if (searchQuery.trim()) {
			images = images.filter(image => 
				(image.original_filename?.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(image.alt_text?.toLowerCase().includes(searchQuery.toLowerCase())) ||
				(image.post_title?.toLowerCase().includes(searchQuery.toLowerCase()))
			);
		}
		
		return images;
	});
	
	function formatFileSize(bytes: number): string {
		if (!bytes) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
	
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
	
	function toggleImageSelection(imageId: string) {
		if (selectedImages.has(imageId)) {
			selectedImages.delete(imageId);
		} else {
			selectedImages.add(imageId);
		}
		selectedImages = new Set(selectedImages);
	}
	
	function selectAllImages() {
		selectedImages = new Set(filteredImages.map(img => img.id));
	}
	
	function clearSelection() {
		selectedImages = new Set();
	}
	
	async function deleteSelectedImages() {
		if (selectedImages.size === 0) return;
		
		if (!confirm(`Are you sure you want to delete ${selectedImages.size} image(s)?`)) return;
		
		try {
			// Implementation would go here - delete images via API
			console.log('Deleting images:', Array.from(selectedImages));
			alert('Delete functionality would be implemented here');
		} catch (error) {
			console.error('Failed to delete images:', error);
		}
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Media Library</h1>
			<p class="text-muted-foreground">Manage uploaded images and files</p>
		</div>
		<Button>
			<Upload class="mr-2 h-4 w-4" />
			Upload Media
		</Button>
	</div>
	
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Total Images</CardTitle>
				<FileImage class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{data.stats.total_images || 0}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Storage Used</CardTitle>
				<HardDrive class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{formatFileSize(data.stats.total_size || 0)}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Recent Uploads</CardTitle>
				<Calendar class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{data.stats.recent_uploads || 0}</div>
				<p class="text-xs text-muted-foreground">Last 30 days</p>
			</CardContent>
		</Card>
	</div>
	
	<!-- Search and Actions -->
	<Card>
		<CardHeader>
			<CardTitle class="text-lg">Media Library</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="flex flex-col sm:flex-row gap-4">
				<div class="flex-1">
					<div class="relative">
						<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							bind:value={searchQuery}
							placeholder="Search by filename, alt text, or post title..."
							class="pl-10"
						/>
					</div>
				</div>
				
				{#if selectedImages.size > 0}
					<div class="flex gap-2">
						<Button variant="outline" size="sm" onclick={clearSelection}>
							Clear ({selectedImages.size})
						</Button>
						<Button variant="destructive" size="sm" onclick={deleteSelectedImages}>
							<Trash2 class="mr-2 h-4 w-4" />
							Delete Selected
						</Button>
					</div>
				{:else}
					<Button variant="outline" size="sm" onclick={selectAllImages}>
						Select All
					</Button>
				{/if}
			</div>
			
			{#if searchQuery}
				<div class="flex items-center gap-2">
					<span class="text-sm text-muted-foreground">
						Showing {filteredImages.length} of {data.images.length} images
					</span>
					<Badge variant="secondary">
						Search: "{searchQuery}"
					</Badge>
				</div>
			{/if}
		</CardContent>
	</Card>
	
	<!-- Media Grid -->
	<Card>
		<CardContent class="p-6">
			{#if filteredImages.length === 0}
				<div class="text-center py-12">
					<ImageIcon class="mx-auto h-12 w-12 text-muted-foreground" />
					<h3 class="mt-4 text-lg font-semibold">No images found</h3>
					<p class="text-muted-foreground">
						{#if searchQuery}
							No images match your search criteria.
						{:else}
							Upload your first image to get started.
						{/if}
					</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
					{#each filteredImages as image (image.id)}
						<div class="group relative border rounded-lg overflow-hidden bg-muted/50">
							<!-- Image Preview -->
							<div class="aspect-square bg-muted flex items-center justify-center">
								{#if image.thumbnail_path}
									<img
										src={image.thumbnail_path}
										alt={image.alt_text || image.original_filename}
										class="w-full h-full object-cover"
										loading="lazy"
									/>
								{:else}
									<ImageIcon class="h-8 w-8 text-muted-foreground" />
								{/if}
							</div>
							
							<!-- Overlay Actions -->
							<div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
								<Button size="sm" variant="secondary">
									<Eye class="h-4 w-4" />
								</Button>
								<Button size="sm" variant="secondary">
									<Download class="h-4 w-4" />
								</Button>
								<Button size="sm" variant="destructive">
									<Trash2 class="h-4 w-4" />
								</Button>
							</div>
							
							<!-- Selection Checkbox -->
							<div class="absolute top-2 left-2">
								<input
									type="checkbox"
									checked={selectedImages.has(image.id)}
									onchange={() => toggleImageSelection(image.id)}
									class="w-4 h-4 rounded border-gray-300"
								/>
							</div>
							
							<!-- Info -->
							<div class="p-3 space-y-1">
								<h4 class="text-sm font-medium truncate" title={image.original_filename}>
									{image.original_filename}
								</h4>
								<div class="flex items-center justify-between text-xs text-muted-foreground">
									<span>{formatFileSize(image.original_size)}</span>
									<span>{formatDate(image.created_at)}</span>
								</div>
								{#if image.post_title}
									<div class="text-xs text-muted-foreground truncate">
										Used in: {image.post_title}
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</CardContent>
	</Card>
</div>