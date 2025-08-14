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
	
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	
	async function signOut() {
		if (browser) {
			// Get Supabase client from the page data
			const { createBrowserClient } = await import('@supabase/ssr');
			const { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } = await import('$env/static/public');
			
			const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
			await supabase.auth.signOut();
			goto('/auth');
		}
	}
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
		
		<!-- User Menu -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="ghost" size="sm" class="relative h-8 w-8 rounded-full">
						<User class="h-4 w-4" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-56 bg-popover border border-border shadow-md">
				<DropdownMenu.Group>
					<DropdownMenu.Label class="px-2 py-1.5 text-sm font-semibold">
						Admin Account
					</DropdownMenu.Label>
					{#if user?.phone}
						<div class="px-2 py-1 text-xs text-muted-foreground">
							{user.phone}
						</div>
					{/if}
				</DropdownMenu.Group>
				<DropdownMenu.Separator class="my-1 h-px bg-border" />
				<DropdownMenu.Item 
					onclick={signOut}
					class="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
				>
					<LogOut class="h-4 w-4" />
					Sign Out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>