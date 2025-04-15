<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import "../app.css";
  import { getTheme } from "$lib/theme.svelte";
  import HardPillsLogo from "$lib/assets/hard_pills.png";
  import MobileDrawer from "./mobile-drawer.svelte";
  let { data, children } = $props();
  let { session, supabase } = $derived(data);
  let currentTheme: string;
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
  class="z-[3] bg-pills-pink flex justify-between top-0 left-0 right-0 w-screen h-20 place-items-center fixed"
>
  <div class="w-40 h-full 400/50" id="container-logo relative">
    <img
      alt="hard pills logo"
      src={HardPillsLogo}
      class="md:max-h-auto max-w-full object-cover h-full md:w-full"
    />
  </div>
  <div class="drawer-trigger md:hidden">
    <MobileDrawer />
  </div>
</header>

<nav
  class="z-[2] h-screen bg-pills-pink w-40 fixed top-0 left-0 right-0 place-items-center md:grid hidden"
>
  Nav
</nav>

<main class="w-screen pt-20 md:pr-40 h-auto">
  {@render children?.()}
</main>
