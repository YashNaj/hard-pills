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

<div class="tiptap-editor-wrapper border border-border rounded-lg overflow-hidden">
	{#if editor}
		<!-- Toolbar (remains the same) -->
		<div class="toolbar bg-muted/50 border-b border-border p-2 flex flex-wrap gap-1 sticky top-0 z-10">
            <!-- ... toolbar buttons ... -->
            <ToggleGroup type="multiple" size="sm" class="flex-wrap">
                <ToggleGroupItem value="bold" aria-label="Toggle bold" data-state={editor.isActive('bold') ? 'on' : 'off'} on:click={() => editor.chain().focus().toggleBold().run()}><Bold class="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Toggle italic" data-state={editor.isActive('italic') ? 'on' : 'off'} on:click={() => editor.chain().focus().toggleItalic().run()}><Italic class="h-4 w-4" /></ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" size="sm" class="flex-wrap">
                 <ToggleGroupItem value="heading2" aria-label="Toggle H2" data-state={editor.isActive('heading', { level: 2 }) ? 'on' : 'off'} on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 class="h-4 w-4" /></ToggleGroupItem>
                 <ToggleGroupItem value="heading3" aria-label="Toggle H3" data-state={editor.isActive('heading', { level: 3 }) ? 'on' : 'off'} on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 class="h-4 w-4" /></ToggleGroupItem>
                 <ToggleGroupItem value="heading4" aria-label="Toggle H4" data-state={editor.isActive('heading', { level: 4 }) ? 'on' : 'off'} on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}><Heading4 class="h-4 w-4" /></ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="multiple" size="sm" class="flex-wrap">
                 <ToggleGroupItem value="bulletList" aria-label="Toggle bullet list" data-state={editor.isActive('bulletList') ? 'on' : 'off'} on:click={() => editor.chain().focus().toggleBulletList().run()}><List class="h-4 w-4" /></ToggleGroupItem>
                 <ToggleGroupItem value="orderedList" aria-label="Toggle ordered list" data-state={editor.isActive('orderedList') ? 'on' : 'off'} on:click={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered class="h-4 w-4" /></ToggleGroupItem>
            </ToggleGroup>
            <Button variant="ghost" size="sm" on:click={setLink} disabled={!editor.can().setLink({ href: '' })} data-active={editor.isActive('link') ? 'is-active' : undefined}><LinkIcon class="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" on:click={() => document.getElementById('image-upload-input')?.click()} disabled={isUploading}><ImagePlus class="h-4 w-4" /></Button>
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
	<!-- Use bind:this to get the DOM node -->
	<div bind:this={editorElement}>
		<!-- Tiptap will render its ProseMirror view inside this div -->
        <!-- No need for <EditorContent> component -->
	</div>
</div>

<!-- Component-specific styles (remain the same) -->
<style>
    /* Use :global(.ProseMirror) to target the actual editor element Tiptap creates */
    :global(.ProseMirror) {
        font-family: system-ui, -apple-system, sans-serif; /* Built-in system font */
        min-height: 300px;
        padding: 1rem; /* Add padding directly here */
        outline: none; /* Remove default outline */
        line-height: 1.6;
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
