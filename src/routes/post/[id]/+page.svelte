<!-- src/routes/post/[slug]/+page.svelte -->
<script lang="ts">
  import PostArticle from "../article-post.svelte";
  import { page } from "$app/stores";

  // In a real app, this would come from your data loading
  // Here we're just mocking it based on the route parameter
  const posts = $state([
    {
      id: "1",
      slug: "getting-started-with-svelte",
      title: "Getting Started with Svelte",
      caption: "A beginner's guide to Svelte and SvelteKit",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070",
      views: 1245,
      content: `
        <h2>Introduction to Svelte</h2>
        <p>Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app.</p>
        
        <p>Instead of using techniques like virtual DOM diffing, Svelte writes code that surgically updates the DOM when the state of your app changes.</p>
        
        <h2>Getting Started</h2>
        <p>The easiest way to start building a Svelte app is to use SvelteKit, the official application framework from the Svelte team:</p>
        
        <pre><code>npm create svelte@latest my-app
cd my-app
npm install
npm run dev</code></pre>
        
        <h2>Component Structure</h2>
        <p>Svelte components are written in .svelte files, which contain HTML, CSS, and JavaScript together in a single file.</p>
        
        <p>Each .svelte file consists of three parts:</p>
        
        <ol>
          <li><strong>Script</strong>: Contains JavaScript that runs when a component instance is created</li>
          <li><strong>Styles</strong>: Contains CSS that's scoped to the component</li>
          <li><strong>Markup</strong>: Contains the HTML template for your component</li>
        </ol>
        
        <h2>Reactivity</h2>
        <p>Svelte's reactivity is simple but powerful. When you update a variable that a component references, it automatically updates the DOM.</p>
        
        <p>To demonstrate, here's a simple counter example:</p>
        
        <pre><code>&lt;script&gt;
  let count = 0;
  
  function increment() {
    count += 1;
  }
&lt;/script&gt;

&lt;button on:click={increment}&gt;
  Clicked {count} {count === 1 ? 'time' : 'times'}
&lt;/button&gt;</code></pre>
        
        <h2>Conclusion</h2>
        <p>Svelte offers a refreshing approach to building web applications with less code and better performance. Its compiler-centric approach means your users don't pay the cost of the framework's abstractions.</p>
        
        <p>Start building with Svelte today and experience the joy of a truly reactive and efficient web framework!</p>
      `,
    },
    {
      id: "2",
      slug: "building-with-shadcn",
      title: "Building with Shadcn/Svelte",
      caption: "How to use Shadcn UI components in your Svelte 5 projects",
      image:
        "https://images.unsplash.com/photo-1600267185393-e158a98703de?q=80&w=2070",
      views: 872,
      content: `
        <h2>Introduction to Shadcn UI for Svelte</h2>
        <p>Shadcn UI is a collection of beautifully designed, accessible components that you can copy and paste into your apps. Originally created for React, it has been ported to Svelte as shadcn-svelte.</p>
        
        <p>What makes shadcn different from traditional component libraries is that you own the code - you're not installing a dependency, but rather adding the component code directly to your project where you can customize it as needed.</p>
        
        <h2>Getting Started</h2>
        <p>To start using shadcn-svelte in your SvelteKit project, you'll need to initialize it:</p>
        
        <pre><code>npx shadcn-svelte init</code></pre>
        
        <p>This will guide you through setting up your project with the necessary configuration.</p>
        
        <h2>Adding Components</h2>
        <p>Once initialized, you can add individual components as needed:</p>
        
        <pre><code>npx shadcn-svelte add button</code></pre>
        
        <p>This will add the Button component to your project, along with any dependencies it needs.</p>
        
        <h2>Using Components</h2>
        <p>After adding components, you can import and use them in your Svelte files:</p>
        
        <pre><code>&lt;script&gt;
  import { Button } from "$lib/components/ui/button";
&lt;/script&gt;

&lt;Button variant="outline"&gt;Click me&lt;/Button&gt;</code></pre>
        
        <h2>Customizing Components</h2>
        <p>The beauty of shadcn is that you own the code. You can find the component files in your project directory (usually $lib/components/ui) and modify them to suit your specific needs.</p>
        
        <p>For example, you might want to customize the button component to match your brand colors or add additional variants.</p>
        
        <h2>Theming</h2>
        <p>Shadcn components work with Tailwind CSS, so you can customize your theme by modifying your tailwind.config.js file:</p>
        
        <pre><code>/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5",
          // Add more shades as needed
        },
      },
    },
  },
}</code></pre>
        
        <h2>Conclusion</h2>
        <p>Shadcn/Svelte offers a great way to build beautiful, accessible UIs without sacrificing control or customizability. Since you own the code, you're never locked into design decisions you can't change.</p>
        
        <p>Start building with shadcn-svelte today and enjoy the perfect balance of design convenience and developer control!</p>
      `,
    },
    {
      id: "3",
      slug: "view-transitions-api",
      title: "Using the View Transitions API",
      caption: "Create smooth transitions between pages in your web app",
      image:
        "https://images.unsplash.com/photo-1617042375876-a13e36732a04?q=80&w=2070",
      views: 638,
      content: `
        <h2>Introduction to the View Transitions API</h2>
        <p>The View Transitions API is a powerful new browser feature that enables smooth transitions between different states of your web application. It's especially useful for page transitions in single-page applications or when navigating between pages in multi-page applications.</p>
        
        <p>Traditionally, creating smooth transitions between pages required complex JavaScript libraries and custom code. The View Transitions API simplifies this process by providing a declarative way to define transitions.</p>
        
        <h2>How It Works</h2>
        <p>The View Transitions API works by taking a snapshot of the current DOM state, applying the transition, and then taking a snapshot of the new state. The browser handles the animation between these two states.</p>
        
        <p>The basic pattern is:</p>
        
        <ol>
          <li>Mark elements that need to transition with view-transition-name</li>
          <li>Start a view transition</li>
          <li>Update the DOM</li>
          <li>Let the browser animate between the old and new states</li>
        </ol>
        
        <h2>Basic Example</h2>
        <p>Here's a simple example of using the View Transitions API:</p>
        
        <pre><code>// Apply view transition names to elements
document.querySelector('.hero-image').style.viewTransitionName = 'hero-image';
document.querySelector('.article-title').style.viewTransitionName = 'article-title';

// Start a view transition
document.startViewTransition(() => {
  // Update the DOM here
  updatePageContent();
});</code></pre>
        
        <h2>Using with SvelteKit</h2>
        <p>SvelteKit provides a convenient way to hook into navigation events, making it perfect for implementing view transitions:</p>
        
        <pre><code>import { onNavigate } from '$app/navigation';

onNavigate((navigation) => {
  if (!document.startViewTransition) return;
  
  return new Promise((resolve) => {
    document.startViewTransition(async () => {
      resolve();
      await navigation.complete;
    });
  });
});</code></pre>
        
        <h2>Styling Transitions</h2>
        <p>Once you've set up the basic mechanism, you can customize the transitions using CSS:</p>
        
        <pre><code>@keyframes fade-in {
  from { opacity: 0; }
}

@keyframes slide-from-right {
  from { transform: translateX(30px); }
}

::view-transition-old(root) {
  animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out;
}

::view-transition-new(root) {
  animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
             300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}</code></pre>
        
        <h2>Conclusion</h2>
        <p>The View Transitions API brings native, performant page transitions to the web platform. This enables developers to create smoother, more engaging user experiences without relying on heavy JavaScript libraries.</p>
        
        <p>While browser support is still growing, it's a perfect candidate for progressive enhancement - falling back gracefully on browsers that don't support it yet.</p>
      `,
    },
  ]);

  // Find the post that matches the current slug
  const currentSlug = $derived($page.params.slug);
  const post = $derived(posts.find((p) => p.slug === currentSlug) || posts[0]);
</script>

<PostArticle {post} />
