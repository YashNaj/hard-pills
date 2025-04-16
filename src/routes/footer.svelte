<script lang="ts">
  import { ROUTES } from "$lib/const";
  import { Twitter, Instagram, Facebook, Github } from "lucide-svelte";
  import SupabaseMark from "$lib/assets/supabase-logo-wordmark--dark.svg";
  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  // Social media links with Lucide icon components
  const socialLinks = [
    { name: "Twitter", url: "https://twitter.com/hardpills", icon: Twitter },
    {
      name: "Instagram",
      url: "https://instagram.com/hardpills",
      icon: Instagram,
    },
    { name: "Facebook", url: "https://facebook.com/hardpills", icon: Facebook },
  ];
</script>

<footer class="bg-pills-pink text-black pt-6 border-t-2 border-black">
  <div class="container mx-auto px-4 mb-4">
    <!-- Top footer section with columns -->
    <div class="flex flex-col">
      <!-- Newsletter signup -->
      <div>
        <h3 class="font-comic text-lg mb-3">STAY UPDATED</h3>
        <p class="text-sm mb-3">
          Subscribe to receive new hard pills in your inbox.
        </p>

        <form class="flex">
          <input
            type="email"
            placeholder="Your email"
            class="px-3 py-2 text-sm rounded-l-md border-y border-l border-black flex-grow"
            required
          />
          <button
            type="submit"
            class="px-3 py-2 bg-purple-700 text-white text-sm font-bold rounded-r-md hover:bg-purple-800 transition-colors"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-black/20 my-4" />

    <!-- Bottom footer section with copyright and social links -->
    <div class="flex justify-between w-full h-auto">
      <div class="text-xs text-right mt-4 ml-2 h-fit">
        © {currentYear} Hard Pills to Swallow. All rights reserved.
      </div>
      <div class="flex space-x-4 mt-4 md:mr-0 mr-2 justify-end">
        {#each socialLinks as link}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            class="text-black hover:text-purple-700 transition-colors"
            aria-label={link.name}
          >
            <svelte:component this={link.icon} size={20} />
          </a>
        {/each}
      </div>
    </div>
  </div>

  <div class="text-white section-tech-and-make w-full font-inter py-6 bg-black">
    <!-- Created by section -->
    <div class="container mx-auto px-4 w-full">

      <!-- disclaimers and trademarks -->
      <div class="mb-6 opacity-40">
        <div
          class="text-xs font-inter md:text-left md:flex justify-between items-center max-w-prose"
        >
          <div class="mt-2 md:mt-0">
            <p>
              All trademarks, logos, and brand names are the property of their
              respective owners. All company, product, and service names used on
              this website are for identification purposes only.
            </p>
          </div>
        </div>
        <div class="text-xs mt-3 font-inter max-w-prose">
          <p>
            The information provided on this site is for general informational
            purposes only. All information is provided in good faith, however we
            make no representation or warranty regarding the accuracy, validity,
            or completeness of any information on this site.
          </p>
        </div>
      </div>
      <div class="flex justify-between">
        <div
          class="flex flex-col items-center font-inter justify-center opacity-40"
        >
          <div class="text-left mb-3 flex justify-start">
            <p class="text-xs font-medium flex items-center">
              Logo, design, and dev by Yash with ❤️
            </p>
          </div>
          <div class="flex w-full h-auto justify-between mb-1">
            <a
              href="mailto:business@yashnaj.dev"
              class="text-xs flex items-center hover:text-pills-pink hover:opacity-100  transition-all text-left"
            >
              business@yashnaj.dev
            </a>

            <div class="w-[.1rem] h-full bg-white"></div>

            <a
              href="https://github.com/YashNaj"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white hover:text-pills-pink hover:opacity-100 transition-all"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
          </div>

          <a
            href="https://yashnaj.dev"
            class="text-xs w-full flex items-center hover:text-pills-pink hover:opacity-100 transition-colors text-left"
          >
            https://yashnaj.dev
          </a>
        </div>

        <!-- Technology section -->
        <div
          class="flex flex-col opacity-40 bg-black text-white justify-between items-end"
        >
          <p class="text-right text-xs font-medium">Powered by</p>
          <a
            href="https://ui.shadcn.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center hover:text-pills-pink hover:opacity-100 space-y-2 transition-colors"
          >
            <span class="text-xs font-inter font-extrabold">shadcn/ui</span>
          </a>

          <a
            href="https://supabase.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center hover:text-pills-pink hover:opacity-100 transition-colors"
          >
            <img src={SupabaseMark} alt="Supabase" class="h-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>
