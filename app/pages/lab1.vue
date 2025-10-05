<template>
	<UContainer>
		<div class="relative">
			<UColorModeButton class="absolute top-0 right-0 z-10" />
			<div class="flex flex-col gap-8 py-4">
				<Lab1Part1 />
				<Lab1Part2 />
				<Lab1SimpleIO />

				<div class="text-center">
					<UButton to="/" variant="outline">Back to Home</UButton>
				</div>
			</div>
		</div>
	</UContainer>
</template>
