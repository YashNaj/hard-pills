<script lang="ts">
  import { ROUTES } from "$lib/const";
  import { onMount } from "svelte";
  let { currentPath } = $props();
  // References
  let navContainer;
  let activeIndicator;
  // Watch for path changes
  $effect(() => {
    if (currentPath) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(updateIndicator, 10);
    }
  });
  function updateIndicator() {
    // Find the active link
    const links = navContainer?.querySelectorAll("a") || [];
    // Find the active link using the URL
    let activeLink = null;
    links.forEach((link) => {
      if (link.getAttribute("href") === currentPath) {
        activeLink = link;
      }
    });
    if (activeLink && activeIndicator) {
      // Get position data
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = navContainer.getBoundingClientRect();
      // Update indicator position and size
      activeIndicator.style.width = `${linkRect.width}px`;
      activeIndicator.style.left = `${linkRect.left - navRect.left}px`;
      activeIndicator.style.opacity = "1";
    } else if (activeIndicator) {
      activeIndicator.style.opacity = "0";
    }
  }
  onMount(() => {
    // Initial position
    setTimeout(updateIndicator, 50);
    // Handle window resize
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  });
</script>

<nav
  class="hidden text-black md:flex items-center gap-2 mr-4 relative"
  bind:this={navContainer}
>
  {#each Object.values(ROUTES) as route}
    <a
      href={route.url}
      class="font-comic text-lg px-4 py-2 transition-all hover:text-purple-200"
      class:active={currentPath === route.url}
    >
      {route.title.toUpperCase()}
    </a>
  {/each}
  <!-- Active indicator -->
  <div class="active-indicator" bind:this={activeIndicator}></div>
</nav>

<style>
  nav {
    padding-bottom: 3px;
  }
  .active {
    color: black;
  }
  .active-indicator {
    position: absolute;
    bottom: 0;
    height: 12px;
    background-color: black;
    /* True parallelogram shape with identical angles on both sides */
    clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 100%, 0 100%);
    transition:
      left 0.3s ease,
      width 0.3s ease;
    opacity: 0;
    pointer-events: none;
    transform: rotate(-3deg);
  }
</style>
