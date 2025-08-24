<!-- lib/components/article-post.svelte -->
<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";

	interface Post {
		id: string;
		title: string;
		content: string;
		slug: string;
		author: string;
		createdAt: string;
		updatedAt?: string;
		submissionId?: string;
		scheduledAt?: string;
		status: string;
		headerImageId?: string;
		featured?: boolean;
		// Additional fields passed from server
		imageUrl?: string | null;
		date?: string;
		categories?: string[];
		description?: string;
	}

	let { post }: { post: Post } = $props();
	const views = Math.floor(Math.random() * 1500) + 500;

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



    function goBack() {
        if (browser) {
            history.back();
        }
	}
	// --- View Transition Setup ---
	let viewTransitionStyleBase = $state("");
	onMount(() => {
		if (browser && "startViewTransition" in document) {
			viewTransitionStyleBase = "view-transition-name: ";
		}
	});

	// Names for elements that should morph + the content block
	const imageTransitionName = $derived(
		viewTransitionStyleBase
			? `${viewTransitionStyleBase} post-${post.id}-image`
			: "",
	);
	const titleTransitionName = $derived(
		viewTransitionStyleBase
			? `${viewTransitionStyleBase} post-${post.id}-title`
			: "",
	);
	const categoriesTransitionName = $derived(
		viewTransitionStyleBase
			? `${viewTransitionStyleBase} post-${post.id}-categories`
			: "",
	); // For the wrapper div
	const metaTransitionName = $derived(
		viewTransitionStyleBase
			? `${viewTransitionStyleBase} post-${post.id}-meta`
			: "",
	); // For the author/date div
	const contentTransitionName = $derived(
		viewTransitionStyleBase
			? `${viewTransitionStyleBase} post-${post.id}-content`
			: "",
	); // For the article text block
	// --- End View Transition Setup ---
</script>

<article class="w-screen mb-16 ">

	<div class = 'h-fit'>


<div
						style={imageTransitionName}
	class="relative mx-auto  w-screen border-4 border-black 700 shadow-[0px_0px_0px_6px_#000000] overflow-hidden mt-2 h-[440px]" 
>
			<div
				class="w-full h-full overflow-hidden  bg-gray-800"
			>
				{#if post.imageUrl}
					<!-- IMAGE: Add transition name -->
					<img
						src={post.imageUrl}
						alt={post.title}
						class="w-full h-full object-cover"
					/>
				{:else}
					<div
						class="w-full h-full bg-purple-300 flex items-center justify-center"
					>
						<span class="text-purple-800 opacity-50">No Image</span>
					</div>
				{/if}
			</div>
	</div>

	</div>
	<!-- Main Content Area -->
	<div class="relative z-10 max-w-[85ch] mx-auto px-4 md:px-0">
		<header class="mb-8 border-b-2 border-black pb-6">
			<!-- Categories would need to be handled differently since they're not in the schema -->
			<!-- Removing categories section for now -->

			<!-- TITLE: Add transition name -->
			<h1
				class="text-4xl md:text-5xl font-bangers font-extrabold tracking-tight mb-4 uppercase text-black font-heading"
				style={titleTransitionName}
			>
				{post.title}
			</h1>

			<!-- Description would need to come from content or be added to schema -->
			<!-- Removing description section for now -->

			<!-- Meta Info Section -->
			<div
				class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 text-sm uppercase font-semibold tracking-wide"
			>
				<!-- META WRAPPER: Add transition name -->
				<div class="text-gray-600" style={metaTransitionName}>
					<span>By Author</span> <!-- Author is UUID, would need to join with users table -->
					<span class="mx-2">•</span>
					<span>{formatDate(post.createdAt)}</span>
				</div>
				<!-- Right side: Views/Back (These don't transition individually) -->
				<div class="flex items-center gap-4">
					<Badge
						variant="outline"
						class="flex items-center gap-1.5 border-2 border-black rounded-md px-3 py-1 bg-purple-100 text-black shadow-[2px_2px_0px_#000]"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-eye"
							><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle
								cx="12"
								cy="12"
								r="3"
							/></svg
						>
						<span>{views} views</span>
					</Badge>
						<Button
							onclick={()=>goBack()}
							variant="outline"
							size="sm"
							class="gap-1.5 border-2 border-black rounded-none px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-black font-bold shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] transition-all"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-arrow-left"
								><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg
							>
							Back to posts
						</Button>
				</div>
			</div>
		</header>

		<!-- ARTICLE CONTENT: Add specific transition name -->
		<div
			class="prose prose-lg prose-stone dark:prose-invert max-w-none mt-8"
			style={contentTransitionName}
		>
			{@html post.content || "<p>Article content goes here...</p>"}
		</div>
	</div>
</article>
