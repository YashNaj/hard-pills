<script lang="ts">
	import { SidebarProvider, SidebarInset } from '$lib/components/ui/sidebar';
	import AdminHeader from './components/admin-header.svelte';
	import AdminSidebar from './components/admin-sidebar.svelte';
	import '../../app.css'	
	let { children, data } = $props();
	let open = $state(true);
</script>

	<SidebarProvider class='bg-pink-50 font-sans' bind:open>
		<AdminSidebar />
		<SidebarInset>
			<AdminHeader user={data?.user} />
			<main class="flex-1 bg-pink-50 admin-layout flex flex-col font-sans overflow-auto ">
				{@render children?.()}
			</main>
		</SidebarInset>
	</SidebarProvider>

<style>
	/* Override global Bangers font for admin routes only */
	:global(.admin-layout *) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}
</style>	
	
