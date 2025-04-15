<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import "../app.css";
  import { getTheme } from "$lib/theme.svelte";
  import HardPillsLogo from "$lib/assets/hard_pills.png";
  import MobileDrawer from "./mobile-drawer.svelte";
  import DesktopNav from "./desktop-nav.svelte";

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
      }
    });
    return () => data.subscription.unsubscribe();
  });
</script>

<header
  class="z-[49] bg-pills-pink flex justify-between top-0 left-0 right-0 w-screen h-20 place-items-center fixed"
>
  <a class="w-40 h-full 400/50" id="container-logo relative" href="/">
    <img
      alt="hard pills logo"
      src={HardPillsLogo}
      class="md:max-h-auto max-w-full object-cover h-full md:w-full"
    />
  </a>

  <!-- Use the exported ROUTES constant -->
  <DesktopNav {currentPath} />

  <div class="drawer-trigger md:hidden">
    <MobileDrawer />
  </div>
</header>

<main class="w-screen h-auto pt-20">
  {@render children?.()}
</main>
