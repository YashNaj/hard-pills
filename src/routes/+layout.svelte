<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { onNavigate } from "$app/navigation";
  import "../app.css";
  import "../halftone.css";
  import "../view-transition.css";
  import { getTheme } from "$lib/theme.svelte";

  let { data, children } = $props();

  // Use $derived rune to access data properties
  const { session, supabase } = $derived(data);

  // Use $state rune for reactive state
  const currentTheme = $state();

  // Use $derived for reactive path
  const currentPath = $derived($page.url.pathname);

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
        s - component - set;
      }
    });
    return () => data.subscription.unsubscribe();
  });

  // --- Official SvelteKit View Transition Integration using onNavigate ---
  onNavigate((navigation) => {
    // Check for browser environment AND API support
    if (!browser || !document.startViewTransition) {
      return; // Don't intercept if not supported or during SSR
    }

    // Return a promise that resolves when the view transition is setup
    return new Promise((resolve) => {
      // Call startViewTransition
      document.startViewTransition(async () => {
        // Signal SvelteKit to continue with the DOM update
        resolve();
        // Wait for SvelteKit's navigation process (DOM updates) to complete
        await navigation.complete;
      });
    });
  });
  // --- End View Transition Integration ---
</script>
    
{@render children?.()}
