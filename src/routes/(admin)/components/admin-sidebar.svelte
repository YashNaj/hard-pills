<script lang="ts">
	import { page } from "$app/stores";
	import {
		Sidebar,
		SidebarContent,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarGroup,
		SidebarGroupLabel,
		SidebarGroupContent,
		SidebarFooter,
	} from "$lib/components/ui/sidebar";
	import {
		PenTool,
		FileText,
		Users,
		Settings,
		BarChart3,
		Mail,
		Image,
		Calendar,
		Inbox,
		Archive,
	} from "lucide-svelte";
	import HardPillsLogo from "$lib/assets/hard_pills.png";

	// Navigation items
	const navigation = [
		{
			title: "Content",
			items: [
				{
					title: "Editor",
					url: "/admin/editor",
					icon: PenTool,
					description: "Create and edit posts",
				},
				{
					title: "Posts",
					url: "/admin/posts",
					icon: FileText,
					description: "Manage all posts",
				},
				{
					title: "Submissions",
					url: "/admin/submissions",
					icon: Inbox,
					description: "User submissions",
				},
				{
					title: "Media",
					url: "/admin/media",
					icon: Image,
					description: "Image library",
				},
			],
		},
		{
			title: "Engagement",
			items: [
				{
					title: "Analytics",
					url: "/admin/analytics",
					icon: BarChart3,
					description: "Site statistics",
				},
				{
					title: "Mailing List",
					url: "/admin/mailing-list",
					icon: Mail,
					description: "Email subscribers",
				},
			],
		},
	];

	// Check if current path matches navigation item
	function isActive(url: string): boolean {
		if (url === "/admin") {
			return $page.url.pathname === "/admin";
		}
		return $page.url.pathname.startsWith(url);
	}
</script>

<Sidebar class="border-r font-sans">
	<SidebarHeader class="border-b h-16 bg-pills-pink">
		<a
			href="/"
			class="flex items-center gap-3 hover:opacity-80 h-full justify-center w-full transition-opacity"
		>
			<div class="flex h-full w-auto items-center justify-center">
				<img
					src={HardPillsLogo}
					alt="Hard Pills Logo"
					class="h-full w-full object-"
				/>
			</div>
		</a>
	</SidebarHeader>

	<SidebarContent class="px-4 py-4">
		{#each navigation as section}
			<SidebarGroup>
				<SidebarGroupLabel
					class="text-xs uppercase tracking-wider text-muted-foreground px-3 py-2"
				>
					{section.title}
				</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						{#each section.items as item}
							<SidebarMenuItem>
								<a href={item.url} class="block w-full">
									<SidebarMenuButton
										isActive={isActive(item.url)}
										class="w-full justify-start cursor-pointer"
									>
										<svelte:component this={item.icon} class="h-4 w-4" />
										<span>{item.title}</span>
									</SidebarMenuButton>
								</a>
							</SidebarMenuItem>
						{/each}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		{/each}
	</SidebarContent>

	<SidebarFooter class="border-t p-4">
		<SidebarMenu>
			<SidebarMenuItem>
				<a href="/admin/settings" class="block w-full">
					<SidebarMenuButton class="w-full justify-start">
						<Settings class="h-4 w-4" />
						<span>Settings</span>
					</SidebarMenuButton>
				</a>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>
</Sidebar>

