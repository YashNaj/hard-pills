<script lang="ts">
	import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { X, Eye, Calendar } from 'lucide-svelte';

	let {
		open = $bindable(false),
		title = '',
		content = '',
		slug = '',
		headerImageUrl = null,
		status = 'draft',
		createdAt = new Date().toISOString()
	}: {
		open?: boolean;
		title?: string;
		content?: string;
		slug?: string;
		headerImageUrl?: string | null;
		status?: string;
		createdAt?: string;
	} = $props();

	function formatDate(dateString: string) {
		try {
			return new Date(dateString).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch (e) {
			return dateString;
		}
	}

	const views = Math.floor(Math.random() * 1500) + 500;
</script>

<Dialog bind:open>
	<DialogOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
	<DialogContent class="fixed top-0 left-0 w-full h-full max-w-none p-0 bg-pink-50 overflow-auto">
		<!-- Header with controls -->
		<div class="sticky top-0 z-50 bg-white border-b border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<Eye class="w-5 h-5 text-purple-600" />
					<DialogTitle class="text-lg font-semibold">Post Preview</DialogTitle>
					<Badge 
						variant={status === 'published' ? 'default' : status === 'scheduled' ? 'secondary' : 'outline'}
						class="ml-2"
					>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</Badge>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onclick={() => open = false}
					class="h-8 w-8 p-0"
				>
					<X class="w-4 h-4" />
				</Button>
			</div>
		</div>

		<!-- Post content using same styling as live post -->
		<article class="w-full mb-16 bg-pink-50">
			<div class="h-fit">
				<!-- Hero Image -->
				<div class="relative mx-auto w-full border-4 border-black shadow-[0px_0px_0px_6px_#000000] overflow-hidden mt-2 h-[440px]">
					<div class="w-full h-full overflow-hidden bg-gray-800">
						{#if headerImageUrl}
							<img
								src={headerImageUrl}
								alt={title}
								class="w-full h-full object-cover"
							/>
						{:else}
							<div class="w-full h-full bg-purple-300 flex items-center justify-center">
								<span class="text-purple-800 opacity-50">No Banner Image</span>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Main Content Area -->
			<div class="relative z-10 max-w-[85ch] mx-auto px-4 md:px-0">
				<header class="mb-8 border-b-2 border-black pb-6">
					<!-- Title -->
					<h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase text-black font-heading">
						{title || 'Untitled Post'}
					</h1>

					<!-- Meta Info Section -->
					<div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 text-sm uppercase font-semibold tracking-wide">
						<!-- Author and Date -->
						<div class="text-gray-600">
							<span>By Author</span>
							<span class="mx-2">•</span>
							<span>{formatDate(createdAt)}</span>
						</div>
						
						<!-- Right side: Views/Back -->
						<div class="flex items-center gap-4">
							<Badge
								variant="outline"
								class="flex items-center gap-1.5 border-2 border-black rounded-md px-3 py-1 bg-purple-100 text-black shadow-[2px_2px_0px_#000]"
							>
								<Eye class="w-3.5 h-3.5" />
								<span>{views} views</span>
							</Badge>
							<Badge
								variant="outline"
								class="flex items-center gap-1.5 border-2 border-black rounded-md px-3 py-1 bg-yellow-100 text-black shadow-[2px_2px_0px_#000]"
							>
								<Calendar class="w-3.5 h-3.5" />
								<span>Preview Mode</span>
							</Badge>
						</div>
					</div>
				</header>

				<!-- Article Content -->
				<div class="prose prose-lg prose-stone dark:prose-invert max-w-none mt-8">
					{#if content && content.trim()}
						{@html content}
					{:else}
						<p class="text-gray-500 italic">No content yet. Start writing in the editor...</p>
					{/if}
				</div>
			</div>
		</article>
	</DialogContent>
</Dialog>

<style>
	/* Match the live post styling for consistency */
	:global(.font-heading) {
		font-family: 'Bangers', cursive;
		letter-spacing: 1px;
	}
</style>