<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { 
		BarChart3, 
		FileText, 
		Users, 
		Inbox,
		TrendingUp,
		TrendingDown,
		Calendar,
		Eye,
		Mail,
		ArrowUpRight
	} from 'lucide-svelte';
	
	let { data } = $props();
	
	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	}
	
	function getGrowthIcon(current: number, previous: number) {
		if (current > previous) return TrendingUp;
		if (current < previous) return TrendingDown;
		return BarChart3;
	}
	
	function getGrowthColor(current: number, previous: number) {
		if (current > previous) return 'text-green-600';
		if (current < previous) return 'text-red-600';
		return 'text-muted-foreground';
	}
</script>

<div class="space-y-6 px-6 py-3">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Analytics</h1>
			<p class="text-muted-foreground">Track your blog's performance and engagement</p>
		</div>
		<div class="flex items-center gap-2">
			<Badge variant="outline">Last 30 days</Badge>
		</div>
	</div>
	
	<!-- Overview Stats -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		<!-- Total Posts -->
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Total Posts</CardTitle>
				<FileText class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{data.stats.posts.total_posts || 0}</div>
				<p class="text-xs text-muted-foreground">
					{data.stats.posts.published_posts || 0} published, {data.stats.posts.draft_posts || 0} drafts
				</p>
			</CardContent>
		</Card>
		
		<!-- Posts This Month -->
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Posts This Month</CardTitle>
				<Calendar class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{data.stats.posts.posts_this_month || 0}</div>
				<p class="text-xs text-green-600">
					{data.stats.posts.posts_this_week || 0} this week
				</p>
			</CardContent>
		</Card>
		
		<!-- Total Submissions -->
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Submissions</CardTitle>
				<Inbox class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{data.stats.submissions.total_submissions || 0}</div>
				<p class="text-xs text-muted-foreground">
					{data.stats.submissions.pending_submissions || 0} pending review
				</p>
			</CardContent>
		</Card>
		
		<!-- Subscribers -->
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Subscribers</CardTitle>
				<Mail class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{data.stats.mailing.total_subscribers || 0}</div>
				<p class="text-xs text-green-600">
					+{data.stats.mailing.new_subscribers_this_month || 0} this month
				</p>
			</CardContent>
		</Card>
	</div>
	
	<!-- Charts Row -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Activity Chart -->
		<Card>
			<CardHeader>
				<CardTitle>Recent Activity</CardTitle>
				<p class="text-sm text-muted-foreground">Posts and submissions over the last 30 days</p>
			</CardHeader>
			<CardContent>
				{#if data.activity.length === 0}
					<div class="h-48 flex items-center justify-center text-muted-foreground">
						<div class="text-center">
							<BarChart3 class="mx-auto h-8 w-8 mb-2" />
							<p>No activity data available</p>
						</div>
					</div>
				{:else}
					<!-- Simple activity list for now -->
					<div class="space-y-2 max-h-48 overflow-auto">
						{#each data.activity.slice(0, 10) as activity}
							<div class="flex items-center justify-between p-2 rounded-lg bg-muted/50">
								<div class="flex items-center gap-2">
									{#if activity.type === 'posts'}
										<FileText class="h-4 w-4 text-blue-600" />
									{:else}
										<Inbox class="h-4 w-4 text-green-600" />
									{/if}
									<span class="text-sm">{activity.count} {activity.type}</span>
								</div>
								<span class="text-xs text-muted-foreground">
									{formatDate(activity.date)}
								</span>
							</div>
						{/each}
					</div>
				{/if}
			</CardContent>
		</Card>
		
		<!-- Top Posts -->
		<Card>
			<CardHeader>
				<CardTitle>Recent Published Posts</CardTitle>
				<p class="text-sm text-muted-foreground">Your latest published content</p>
			</CardHeader>
			<CardContent>
				{#if data.topPosts.length === 0}
					<div class="h-48 flex items-center justify-center text-muted-foreground">
						<div class="text-center">
							<FileText class="mx-auto h-8 w-8 mb-2" />
							<p>No published posts yet</p>
						</div>
					</div>
				{:else}
					<div class="space-y-3 max-h-48 overflow-auto">
						{#each data.topPosts as post}
							<div class="flex items-center justify-between p-2 rounded-lg bg-muted/50">
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2">
										<h4 class="text-sm font-medium truncate">{post.title}</h4>
										{#if post.featured}
											<Badge variant="secondary" class="text-xs">Featured</Badge>
										{/if}
									</div>
									<div class="flex items-center gap-2 mt-1">
										<Badge variant="outline" class="text-xs">{post.status}</Badge>
										<span class="text-xs text-muted-foreground">
											{formatDate(post.created_at)}
										</span>
									</div>
								</div>
								<div class="flex items-center gap-1">
									<a 
										href="/admin?edit={post.id}"
										class="p-1 hover:bg-background rounded"
									>
										<ArrowUpRight class="h-4 w-4" />
									</a>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</CardContent>
		</Card>
	</div>
	
	<!-- Quick Actions -->
	<Card>
		<CardHeader>
			<CardTitle>Quick Actions</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<a 
					href="/admin?new=true"
					class="flex items-center gap-3 p-4 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors"
				>
					<FileText class="h-5 w-5 text-muted-foreground" />
					<div>
						<h4 class="font-medium">Create New Post</h4>
						<p class="text-sm text-muted-foreground">Start writing content</p>
					</div>
				</a>
				
				<a 
					href="/admin/submissions"
					class="flex items-center gap-3 p-4 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors"
				>
					<Inbox class="h-5 w-5 text-muted-foreground" />
					<div>
						<h4 class="font-medium">Review Submissions</h4>
						<p class="text-sm text-muted-foreground">{data.stats.submissions.pending_submissions || 0} pending</p>
					</div>
				</a>
				
				<a 
					href="/admin/media"
					class="flex items-center gap-3 p-4 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors"
				>
					<Eye class="h-5 w-5 text-muted-foreground" />
					<div>
						<h4 class="font-medium">Manage Media</h4>
						<p class="text-sm text-muted-foreground">Upload and organize</p>
					</div>
				</a>
			</div>
		</CardContent>
	</Card>
</div>
