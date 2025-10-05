<script setup lang="ts">
import {
	HammingCodeEncode,
	HammingCodeDecode,
	HammingCodeCorrection,
} from "~~/utils/lab1";

const inputEncode = ref("10011010");
const inputDecode = ref("");
const inputCorrect = ref("");

const outputEncode = computed(() => {
	try {
		return HammingCodeEncode(inputEncode.value, true);
	} catch (e) {
		return "Invalid input";
	}
});

const outputDecode = computed(() => {
	try {
		return HammingCodeDecode(inputDecode.value, true);
	} catch (e) {
		return "Invalid input";
	}
});

const outputCorrect = computed(() => {
	try {
		return HammingCodeCorrection(inputCorrect.value, true);
	} catch (e) {
		return "Invalid input";
	}
});
</script>

<template>
	<UCard>
		<template #header>
			<h2 class="text-lg font-semibold">
				Simple Hamming Code Operations
			</h2>
		</template>
		<div class="space-y-6">
			<div class="space-y-2">
				<label class="block text-sm font-medium">Encode</label>
				<UInput
					v-model="inputEncode"
					placeholder="Enter binary string"
				/>
				<code
					class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
				>
					{{ outputEncode }}
				</code>
			</div>

			<div class="space-y-2">
				<label class="block text-sm font-medium">Decode</label>
				<UInput
					v-model="inputDecode"
					placeholder="Enter encoded binary string"
				/>
				<code
					class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
				>
					{{ outputDecode }}
				</code>
			</div>

			<div class="space-y-2">
				<label class="block text-sm font-medium"
					>Correct & Decode</label
				>
				<UInput
					v-model="inputCorrect"
					placeholder="Enter corrupted binary string"
				/>
				<code
					class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
				>
					{{ outputCorrect }}
				</code>
			</div>
		</div>
	</UCard>
</template>
