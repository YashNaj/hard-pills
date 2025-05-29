<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { SidebarTrigger } from '$lib/components/ui/sidebar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { 
		Menu, 
		Bell, 
		Settings, 
		User, 
		LogOut,
		Plus 
	} from 'lucide-svelte';
	
	let { user = null } = $props<{ user?: any }>();
</script>

<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
	<SidebarTrigger class="-ml-1" />
	
	<div class="flex items-center gap-2">
		<h1 class="text-lg font-semibold">Hard Pills Admin</h1>
	</div>
	
	<div class="ml-auto flex items-center gap-2">
		<!-- Quick Actions -->
		<Button variant="outline" size="sm" href="/admin?new=true">
			<Plus class="h-4 w-4" />
			New Post
		</Button>
		
		<!-- Notifications -->
		<Button variant="ghost" size="sm">
			<Bell class="h-4 w-4" />
		</Button>
		
		<!-- User Menu - Simplified for now -->
		<Button variant="ghost" size="sm" class="relative h-8 w-8 rounded-full">
			<User class="h-4 w-4" />
		</Button>
	</div>
</header>