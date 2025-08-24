<script lang="ts">
	import { SidebarProvider, SidebarInset } from '$lib/components/ui/sidebar';
	import AdminHeader from './components/admin-header.svelte';
	import AdminSidebar from './components/admin-sidebar.svelte';
	import '../../app.css'	
	let { children, data } = $props();
	let open = $state(true);
</script>

	<SidebarProvider class='bg-pink-50 max-h-screen' bind:open>
		<AdminSidebar />
		<SidebarInset>
		<div class = 'h-fit flex flex-col max-h-parent overflow-hidden'>
		<AdminHeader user={data?.user} />
			<main class="h-full bg-pink-50 admin-layout font-sans overflow-auto">
				{@render children?.()}
			</main>
		</div>	
		</SidebarInset>
	</SidebarProvider>

<style>
	/* Override global Bangers font for admin routes only */
	:global(.admin-layout *) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}
</style>	
	
