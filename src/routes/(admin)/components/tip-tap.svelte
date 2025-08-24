<script lang="ts">
	// Core Tiptap imports
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Image from '@tiptap/extension-image';
	import Dropcursor from '@tiptap/extension-dropcursor';
	import Placeholder from '@tiptap/extension-placeholder';
	import Link from '@tiptap/extension-link';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { onDestroy, onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { debounce } from '$lib/utils/utils.js';

	// Shadcn UI components for Toolbar
	import { Button } from '$lib/components/ui/button';
	import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui/toggle-group';
	import { Bold, Italic, Heading2, Heading3, Heading4, List, ListOrdered, ImagePlus, LinkIcon } from 'lucide-svelte';

	// --- Props ---
	let {
		initialContent = '',
		supabase,
		onUpdate = (content: string) => {},
		placeholderText = 'Start writing your amazing post...',
		postId = null,
		title = '',
		slug = '',
		author = ''
	}: {
		initialContent?: string | Record<string, any>;
		supabase: SupabaseClient;
		onUpdate?: (content: string) => void;
		placeholderText?: string;
		postId?: string | null;
		title?: string;
		slug?: string;
		author?: string;
	} = $props();

	// --- State ---
	let editor: Editor | null = $state(null);
	let editorElement: HTMLDivElement | null = $state(null); // <-- Use a standard HTML element type
	let isUploading: boolean = $state(false);
	let uploadError: string | null = $state(null);
	let isSaving: boolean = $state(false);
	let saveError: string | null = $state(null);
	let lastSaved: Date | null = $state(null);

	// --- Image Upload Logic (remains the same) ---
	async function uploadFile(file: File): Promise<string | null> {
        // ... (upload logic as before) ...
        if (!file.type.startsWith('image/')) return null;
        if (!supabase) return null;
        isUploading = true;
        uploadError = null;
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${uuidv4()}.${fileExt}`;
        const filePath = `public/${uniqueFileName}`;
        try {
            const { data, error } = await supabase.storage.from('post_images').upload(filePath, file);
            if (error) throw error;
            const { data: urlData } = supabase.storage.from('post_images').getPublicUrl(filePath);
            if (!urlData?.publicUrl) throw new Error('Failed to get public URL');
            // TODO: Link to DB
            return urlData.publicUrl;
        } catch (error: any) {
            console.error('Upload Error:', error);
            uploadError = error.message || 'Failed to upload image.';
            return null;
        } finally {
            isUploading = false;
        }
    }

	async function handleFiles(files: FileList | null | undefined) {
		if (!files || files.length === 0 || !editor) return;
		for (const file of files) {
			const uploadedUrl = await uploadFile(file);
			if (uploadedUrl) {
				editor.chain().focus().setImage({ src: uploadedUrl, alt: file.name }).run();
			}
		}
	}

	// --- Autosave Logic ---
	async function savePost(content: string) {
		if (!postId || isSaving) return;
		
		isSaving = true;
		saveError = null;
		
		try {
			const response = await fetch('/api/posts', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: postId,
					content,
					title,
					slug,
					updatedAt: new Date().toISOString()
				})
			});
			
			if (!response.ok) {
				throw new Error('Failed to save post');
			}
			
			lastSaved = new Date();
		} catch (error: any) {
			console.error('Save error:', error);
			saveError = error.message || 'Failed to save post';
		} finally {
			isSaving = false;
		}
	}

	const debouncedSave = debounce(savePost, 2000);

	// --- Editor Setup ---
	onMount(() => {
		if (!editorElement) return; // Ensure the element is available

		editor = new Editor({
			element: editorElement, // <-- Pass the bound DOM element here
			extensions: [
                // ... (extensions remain the same: StarterKit, Image, Dropcursor, Placeholder, Link) ...
                StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
                Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { class: 'tiptap-image max-w-full h-auto my-4 mx-auto block border-2 border-dashed border-gray-300 rounded' }}),
                Dropcursor.configure({ color: '#6366f1', width: 2 }),
                Placeholder.configure({ placeholder: placeholderText }),
                Link.configure({ openOnClick: false, autolink: true }),
			],
			content: initialContent,
			editorProps: {
				attributes: {
					// Apply styling classes directly to the ProseMirror element Tiptap creates inside editorElement
					class: 'prose prose-lg dark:prose-invert focus:outline-none min-h-[300px] p-4 editor-styling',
				},
                // --- Drag/Drop/Paste Handling (remains the same) ---
				handleDrop: (view, event, slice, moved) => { /* ... */ event.preventDefault(); if (moved || !event.dataTransfer?.files?.length) return false; handleFiles(event.dataTransfer.files); return true;},
				handlePaste: (view, event, slice) => { /* ... */ event.preventDefault(); if (!event.clipboardData?.files?.length) return false; handleFiles(event.clipboardData.files); return true;}
			},
			onUpdate: ({ editor: currentEditor }) => {
				const content = currentEditor.getHTML();
				onUpdate(content);
				// Autosave with debounce
				if (postId) {
					debouncedSave(content);
				}
			},
		});

		// Need to manually focus sometimes after mount if needed
		// editor?.commands.focus();

		return () => {
			editor?.destroy();
		};
	}); // Make sure dependency array is correct if not using Svelte 5 runes

	// --- Toolbar Actions (remain the same) ---
    function addImageViaInput(event: Event) { /* ... */ const input = event.target as HTMLInputElement; handleFiles(input.files); input.value = '';}
    function setLink() { /* ... */ if (!editor) return; const previousUrl = editor.getAttributes('link').href; const url = window.prompt('URL', previousUrl); if (url === null) return; if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; } editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run(); }

</script>

<div class="tiptap-editor-wrapper h-full flex flex-col">
	{#if editor}
		<!-- Minimal Toolbar -->
		<div class="toolbar bg-background/95 backdrop-blur-sm border-b border-border p-3 flex flex-wrap gap-2 sticky top-0 z-[9] shrink-0">
            <!-- ... toolbar buttons ... -->
            <!-- Text Formatting Buttons -->
            <div class="flex items-center gap-1">
                <Button 
                    variant={editor.isActive('bold') ? 'default' : 'ghost'} 
                    size="sm" 
                    onclick={() => editor.chain().focus().toggleBold().run()}
                    class="h-8 w-8 p-0"
                    aria-label="Toggle bold"
                >
                    <Bold class="h-4 w-4" />
                </Button>
                <Button 
                    variant={editor.isActive('italic') ? 'default' : 'ghost'} 
                    size="sm" 
                    onclick={() => editor.chain().focus().toggleItalic().run()}
                    class="h-8 w-8 p-0"
                    aria-label="Toggle italic"
                >
                    <Italic class="h-4 w-4" />
                </Button>
            </div>
            
            <!-- Heading Buttons -->
            <div class="flex items-center gap-1 border-l border-border pl-2 ml-2">
                <Button 
                    variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'} 
                    size="sm" 
                    onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    class="h-8 w-8 p-0"
                    aria-label="Toggle H2"
                >
                    <Heading2 class="h-4 w-4" />
                </Button>
                <Button 
                    variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'} 
                    size="sm" 
                    onclick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    class="h-8 w-8 p-0"
                    aria-label="Toggle H3"
                >
                    <Heading3 class="h-4 w-4" />
                </Button>
                <Button 
                    variant={editor.isActive('heading', { level: 4 }) ? 'default' : 'ghost'} 
                    size="sm" 
                    onclick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    class="h-8 w-8 p-0"
                    aria-label="Toggle H4"
                >
                    <Heading4 class="h-4 w-4" />
                </Button>
            </div>
            
            <!-- List Buttons -->
            <div class="flex items-center gap-1 border-l border-border pl-2 ml-2">
                <Button 
                    variant={editor.isActive('bulletList') ? 'default' : 'ghost'} 
                    size="sm" 
                    onclick={() => editor.chain().focus().toggleBulletList().run()}
                    class="h-8 w-8 p-0"
                    aria-label="Toggle bullet list"
                >
                    <List class="h-4 w-4" />
                </Button>
                <Button 
                    variant={editor.isActive('orderedList') ? 'default' : 'ghost'} 
                    size="sm" 
                    onclick={() => editor.chain().focus().toggleOrderedList().run()}
                    class="h-8 w-8 p-0"
                    aria-label="Toggle ordered list"
                >
                    <ListOrdered class="h-4 w-4" />
                </Button>
            </div>
            
            <!-- Link and Image Buttons -->
            <div class="flex items-center gap-1 border-l border-border pl-2 ml-2">
                <Button 
                    variant={editor.isActive('link') ? 'default' : 'ghost'} 
                    size="sm" 
                    onclick={setLink} 
                    disabled={!editor.can().setLink({ href: '' })} 
                    class="h-8 w-8 p-0"
                    aria-label="Add link"
                >
                    <LinkIcon class="h-4 w-4" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onclick={() => document.getElementById('image-upload-input')?.click()} 
                    disabled={isUploading}
                    class="h-8 w-8 p-0"
                    aria-label="Add image"
                >
                    <ImagePlus class="h-4 w-4" />
                </Button>
            </div>
            <input type="file" id="image-upload-input" accept="image/*" multiple class="hidden" onchange={addImageViaInput} />
            {#if isUploading} <span class="text-sm text-muted-foreground ml-2">Uploading...</span> {/if}
            {#if uploadError} <span class="text-sm text-destructive ml-2">{uploadError}</span> {/if}
            
            <div class="ml-auto flex items-center gap-2">
                {#if isSaving}
                    <span class="text-sm text-muted-foreground">Saving...</span>
                {:else if lastSaved}
                    <span class="text-sm text-muted-foreground">
                        Saved {lastSaved.toLocaleTimeString()}
                    </span>
                {/if}
                {#if saveError}
                    <span class="text-sm text-destructive">{saveError}</span>
                {/if}
            </div>
		</div>
	{/if}

	<!-- Editor Host Element -->
	<div class="flex-1 overflow-auto">
		<div bind:this={editorElement} class="h-full min-h-[500px]">
			<!-- Tiptap will render its ProseMirror view inside this div -->
		</div>
	</div>
</div>

<!-- Component-specific styles (remain the same) -->
<style>
    /* Use :global(.ProseMirror) to target the actual editor element Tiptap creates */
    :global(.ProseMirror) {
        font-family: system-ui, -apple-system, sans-serif;
        min-height: 500px;
        height: 100%;
        padding: 2rem 3rem; /* Better padding for writing */
        outline: none;
        line-height: 1.7;
        font-size: 16px;
        color: hsl(var(--foreground));
        max-width: none;
    }

    :global(.ProseMirror p) {
        margin-bottom: 0.75em;
        line-height: 1.6;
        color: hsl(var(--foreground) / 0.9);
    }

    :global(.ProseMirror h2),
    :global(.ProseMirror h3),
    :global(.ProseMirror h4),
    :global(.ProseMirror h5),
    :global(.ProseMirror h6) {
        font-family: system-ui, -apple-system, sans-serif; /* Built-in system font */
        font-weight: 600;
        margin-top: 1.5em;
        margin-bottom: 0.75em;
        color: hsl(var(--foreground));
    }

     :global(.ProseMirror ul),
     :global(.ProseMirror ol) {
        padding-left: 1.5rem;
        margin-bottom: 0.75em;
     }
     :global(.ProseMirror li p) {
        margin-bottom: 0.25em;
     }

     :global(.ProseMirror p.is-editor-empty:first-child::before) {
        content: attr(data-placeholder);
        float: left;
        color: hsl(var(--muted-foreground));
        pointer-events: none;
        height: 0;
        font-size: 16px;
        line-height: 1.7;
    }

    :global(.tiptap-image) { /* Target images added by Tiptap */
        border-style: solid;
        border-color: hsl(var(--border));
        border-width: 2px; /* Ensure visibility */
        border-radius: 0.25rem; /* Optional rounded corners */
        display: block; /* Ensure block behavior */
        max-width: 100%;
        height: auto;
        margin: 1rem auto; /* Center images */
    }

    /* Toolbar active states (remain the same) */
    .toolbar :global(button[data-active=is-active]),
    .toolbar :global(button[data-state=on]) {
        background-color: hsl(var(--accent));
        color: hsl(var(--accent-foreground));
    }
</style>
