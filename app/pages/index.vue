<script setup lang="ts">
const labs = [
	{ name: "Lab 1", path: "/lab1" },
	{ name: "Lab 2", path: "/lab2" },
];
</script>
<template>
	<UContainer>
		<div class="relative flex flex-col text-center py-12">
			<UColorModeButton class="absolute top-0 right-0" />
			<h1 class="text-3xl font-bold mb-4">Welcome to the Home Page</h1>
			<p class="text-lg mb-8">
				This is the main landing page of the application.
			</p>
			<div class="flex flex-col gap-4">
				<UButton v-for="lab of labs" :to="lab.path" size="lg">
					{{ lab.name }}
				</UButton>
			</div>
		</div>
	</UContainer>
</template>
