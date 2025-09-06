<script lang="ts">
	import { SidebarProvider, SidebarInset } from '$lib/components/ui/sidebar';
	import AdminHeader from './components/admin-header.svelte';
	import AdminSidebar from './components/admin-sidebar.svelte';
	import '../../app.css'	
	let { children, data } = $props();
	let open = $state(true);
</script>

	<SidebarProvider class='w-screen h-screen bg-pink-50 overflow-hidden' bind:open>
		<AdminSidebar />
		<SidebarInset class="h-screen flex flex-col bg-pink-50 overflow-hidden">
			<AdminHeader user={data?.user} />
			<main class="bg-pink-50 admin-layout font-sans flex-1 overflow-y-auto min-h-0">
				{@render children?.()}
			</main>
		</SidebarInset>
	</SidebarProvider>

<style>
	/* Override global Bangers font for admin routes only */
	:global(.admin-layout *) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}
	
	/* Ensure proper height containment without preventing content scrolling */
	:global(html), :global(body) {
		height: 100vh;
		overflow-x: hidden; /* Only prevent horizontal scrolling */
	}
</style>	
	
