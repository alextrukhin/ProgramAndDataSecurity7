<script setup lang="ts"></script>

<template>
	<UContainer>
		<div class="relative">
			<UColorModeButton class="absolute top-0 right-0 z-10" />
			<div class="flex flex-col gap-8 py-4">
				<Lab3Part1 />
				<Lab3Part3 />
				<Lab3Part5 />
				<Lab3Part7 />

				<div class="text-center">
					<UButton to="/" variant="outline">Back to Home</UButton>
				</div>
			</div>
		</div>
	</UContainer>
</template>
