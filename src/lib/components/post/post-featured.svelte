<!-- src/lib/components/posts/featured-post.svelte -->
<script lang='ts'>
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte'; // Import onMount
	import { browser } from '$app/environment'; // Import browser
	// Removed unused Svelte fade import

	// Define props using Svelte 5 syntax
	let { id, title, description, author, date, categories, imageUrl } = $props();

	// Helper function for simple date formatting
	function formatDate(dateString) {
		try {
			return new Date(dateString + 'T00:00:00Z').toLocaleDateString('en-US', {
				year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
			});
		} catch (e) {
			console.error("Error formatting date:", dateString, e);
			return dateString;
		}
	}

	// --- View Transition Setup ---
	let viewTransitionStyleBase = $state('');
	onMount(() => {
		if (browser && 'startViewTransition' in document) {
			viewTransitionStyleBase = 'view-transition-name: ';
		}
	});

	// Names for elements that should morph
	const imageTransitionName = $derived(viewTransitionStyleBase ? `${viewTransitionStyleBase} post-${id}-image` : '');
	const titleTransitionName = $derived(viewTransitionStyleBase ? `${viewTransitionStyleBase} post-${id}-title` : '');
	const categoriesTransitionName = $derived(viewTransitionStyleBase ? `${viewTransitionStyleBase} post-${id}-categories` : '');
	const metaTransitionName = $derived(viewTransitionStyleBase ? `${viewTransitionStyleBase} post-${id}-meta` : '');
	// ADD name for the content area itself
	const featuredContentAreaTransitionName = $derived(viewTransitionStyleBase ? `${viewTransitionStyleBase} featured-content-area` : '');
	// --- End View Transition Setup ---

</script>

<div
	class="relative mx-auto w-screen border-4 border-black bg-black shadow-[0px_0px_0px_6px_#000000] overflow-hidden mt-2"
>

	{#if imageUrl}
		<div
			class="absolute inset-0 opacity-40 md:opacity-60 mix-blend-luminosity pointer-events-none"
		>
			<img
				src={imageUrl}
				alt=""
				class="w-full h-full object-cover object-right md:object-center"
                style={imageTransitionName}
			/>
		</div>
	{/if}

	<div
        class="relative z-10 p-6 md:p-10 lg:p-12 text-white"
        style={featuredContentAreaTransitionName} 
    >
		<h2
			class="text-5xl md:text-6xl font-extrabold mb-4 uppercase text-pills-pink font-heading tracking-wider"
		>
			FEATURED
		</h2>

		<div class="flex flex-wrap gap-2 mb-4" style={categoriesTransitionName}>
			{#each categories as category}
				<Badge
					variant="default"
					class="bg-black/50 text-white border border-purple-300/50 px-2.5 py-1 rounded-sm text-xs uppercase font-semibold tracking-wide hover:bg-black/70"
				>
					{category}
				</Badge>
			{/each}
		</div>

		<h3
			class="text-3xl md:text-4xl font-bold mb-4 uppercase text-white font-heading tracking-wide"
            style={titleTransitionName}
		>
			{title}
		</h3>

		<p class="text-purple-100/90 mb-6 text-base md:text-lg max-w-xl">
			{description}
		</p>

		<div
			class="flex items-center text-sm text-purple-200/80 mb-6 uppercase font-semibold tracking-wider"
            style={metaTransitionName}
		>
			<span>{author}</span>
			<span class="mx-2">•</span>
			<span>{formatDate(date)}</span>
		</div>

		<Button
			href={`/post/${id}`}
			class="bg-pills-pink text-black border-2 border-black rounded-none px-6 py-2 font-bold uppercase tracking-wider shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:bg-pink-400 transition-all text-sm md:text-base"
		>
			Read Article »
		</Button>
	</div>
</div>
