<script lang="ts">
	import { SidebarProvider, SidebarInset } from '$lib/components/ui/sidebar';
	import AdminHeader from '$lib/components/admin/admin-header.svelte';
	import AdminSidebar from '$lib/components/admin/admin-sidebar.svelte';
	
	let { children, data } = $props();
	let open = $state(true);
</script>

	<SidebarProvider bind:open>
		<AdminSidebar />
		<SidebarInset>
			<AdminHeader user={data?.user} />
			<main class="flex-1 admin-layout overflow-auto p-6">
				{@render children?.()}
			</main>
		</SidebarInset>
	</SidebarProvider>

<style>
	/* Override global Bangers font for admin routes only */
	:global(.admin-layout *) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}
	
	
	/* Ensure all text elements use the system font */
	:global(.admin-layout h1, .admin-layout h2, .admin-layout h3, .admin-layout h4, .admin-layout h5, .admin-layout h6) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		font-weight: 600;
	}
	
	:global(.admin-layout p, .admin-layout span, .admin-layout div, .admin-layout button, .admin-layout input, .admin-layout textarea) {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}
</style>
