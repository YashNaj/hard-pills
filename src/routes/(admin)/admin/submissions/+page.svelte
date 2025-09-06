<script lang="ts">
	import SubmissionsTable from '../../components/submissions-table.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { 
		Inbox, 
		Clock, 
		CheckCircle, 
		XCircle,
		ArrowRight,
		Mail
	} from 'lucide-svelte';
	
	let { data } = $props();
</script>

<div class="flex flex-col h-full space-y-6 p-6">
	<!-- Header -->
	<div class="flex-none flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Submissions</h1>
			<p class="text-muted-foreground">Manage user-submitted content</p>
		</div>
		<Button href="/submit" target="_blank" variant="outline">
			<Mail class="mr-2 h-4 w-4" />
			View Submit Form
		</Button>
	</div>
	
	<!-- Stats Cards -->
	<div class="flex-none grid grid-cols-1 md:grid-cols-5 gap-4">
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Total</CardTitle>
				<Inbox class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{data.meta.total}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Pending</CardTitle>
				<Clock class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-yellow-600">{data.meta.pending}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Approved</CardTitle>
				<CheckCircle class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-green-600">{data.meta.approved}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Rejected</CardTitle>
				<XCircle class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-red-600">{data.meta.rejected}</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Converted</CardTitle>
				<ArrowRight class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-blue-600">{data.meta.converted}</div>
			</CardContent>
		</Card>
	</div>
	
	<!-- Submissions Table -->
	<Card class="flex flex-col flex-1">
		<CardHeader class="flex-none">
			<CardTitle>All Submissions</CardTitle>
		</CardHeader>
		<CardContent class="p-0 flex-1 min-h-0">
			<SubmissionsTable submissions={data.submissions} />
		</CardContent>
	</Card>
</div>
