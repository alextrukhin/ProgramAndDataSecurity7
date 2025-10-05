<script setup lang="ts">
import {
	HammingCodeEncode,
	HammingCodeDecode,
	HammingCodeCorrection,
	replaceCharacterAt,
	getParityBitsIndexes,
} from "~~/utils/lab1";

const textInput = ref("Hello World");
const blockLength = ref(8);
const corruptionEnabled = ref(false);
const bitToCorruptPerBlock = ref(1);

const blockLengthOptions = computed(() => {
	return getParityBitsIndexes(textInput.value.length, "encode").map(
		(i) => i + 1
	);
});

const binaryBlocks = computed(() => {
	const chars = textInput.value.split("");
	let fullBinary = "";

	for (const char of chars) {
		fullBinary += char.charCodeAt(0).toString(2).padStart(8, "0");
	}

	const blocks: string[] = [];
	for (let i = 0; i < fullBinary.length; i += blockLength.value) {
		blocks.push(fullBinary.slice(i, i + blockLength.value));
	}

	return blocks;
});

const encodedBlocks = computed(() => {
	return binaryBlocks.value.map((block) => HammingCodeEncode(block, true));
});

const corruptedBlocks = computed(() => {
	if (!corruptionEnabled.value) return encodedBlocks.value;

	return encodedBlocks.value.map((block) => {
		const bitPos = bitToCorruptPerBlock.value;
		if (bitPos <= 0 || bitPos > block.length) return block;

		return replaceCharacterAt(
			block,
			bitPos - 1,
			block[bitPos - 1] === "0" ? "1" : "0"
		);
	});
});

const correctedBlocks = computed(() => {
	return corruptedBlocks.value.map((block) =>
		HammingCodeCorrection(block, true)
	);
});

const decodedText = computed(() => {
	let binaryString = correctedBlocks.value.join("");
	let result = "";

	for (let i = 0; i < binaryString.length; i += 8) {
		const byte = binaryString.slice(i, i + 8);
		if (byte.length === 8) {
			result += String.fromCharCode(parseInt(byte, 2));
		}
	}

	return result;
});

const statistics = computed(() => {
	const totalBlocks = encodedBlocks.value.length;
	const totalBitsOriginal = binaryBlocks.value.join("").length;
	const totalBitsEncoded = encodedBlocks.value.join("").length;
	const overhead = (
		((totalBitsEncoded - totalBitsOriginal) / totalBitsOriginal) *
		100
	).toFixed(2);

	return {
		totalBlocks,
		totalBitsOriginal,
		totalBitsEncoded,
		overhead,
		recoverySuccessful: decodedText.value === textInput.value,
	};
});
</script>
<template>
	<UCard>
		<template #header>
			<h2 class="text-lg font-semibold">
				Task 2 & 3: Text File Encoding with Configurable Block Length
			</h2>
		</template>
		<div class="space-y-6">
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium mb-1"
						>Input Text</label
					>
					<UTextarea
						v-model="textInput"
						:rows="4"
						placeholder="Enter text to encode..."
					/>
				</div>

				<div>
					<label class="block text-sm font-medium mb-1"
						>Block Length</label
					>
					<USelect
						v-model="blockLength"
						:items="blockLengthOptions"
					/>
				</div>

				<div class="flex items-center gap-4">
					<UCheckbox
						v-model="corruptionEnabled"
						label="Simulate bit corruption (1 bit per block)"
					/>
					<div
						v-if="corruptionEnabled"
						class="flex items-center gap-2"
					>
						<label class="text-sm">Bit position to corrupt:</label>
						<UInput
							v-model.number="bitToCorruptPerBlock"
							type="number"
							min="1"
							class="w-20"
						/>
					</div>
				</div>
			</div>

			<div class="border-t pt-4 space-y-4">
				<h3 class="text-base font-semibold">Encoding Process</h3>

				<div class="space-y-2">
					<h4 class="text-sm font-medium">
						Step 1: Binary Blocks ({{ blockLength }} bits each)
					</h4>
					<code
						class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono text-gray-900 dark:text-gray-100 max-h-32 overflow-y-auto"
					>
						{{ binaryBlocks.join(" | ") }}
					</code>
					<p class="text-xs text-gray-500">
						{{ binaryBlocks.length }} blocks
					</p>
				</div>

				<div class="space-y-2">
					<h4 class="text-sm font-medium">
						Step 2: Hamming Code Encoded Blocks
					</h4>
					<code
						class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono text-gray-900 dark:text-gray-100 max-h-32 overflow-y-auto"
					>
						{{ encodedBlocks.join(" | ") }}
					</code>
				</div>

				<div v-if="corruptionEnabled" class="space-y-2">
					<h4 class="text-sm font-medium">
						Step 3: Corrupted Blocks (1 bit error per block)
					</h4>
					<code
						class="block bg-red-50 dark:bg-red-900/20 p-2 rounded text-xs font-mono text-gray-900 dark:text-gray-100 max-h-32 overflow-y-auto"
					>
						{{ corruptedBlocks.join(" | ") }}
					</code>
				</div>

				<div class="space-y-2">
					<h4 class="text-sm font-medium">
						Step {{ corruptionEnabled ? "4" : "3" }}: Corrected &
						Decoded Blocks
					</h4>
					<code
						class="block bg-green-50 dark:bg-green-900/20 p-2 rounded text-xs font-mono text-gray-900 dark:text-gray-100 max-h-32 overflow-y-auto"
					>
						{{ correctedBlocks.join(" | ") }}
					</code>
				</div>

				<div class="space-y-2">
					<h4 class="text-sm font-medium">Final Decoded Text:</h4>
					<code
						class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
					>
						{{ decodedText }}
					</code>
					<UBadge
						:color="
							statistics.recoverySuccessful ? 'success' : 'error'
						"
					>
						{{
							statistics.recoverySuccessful
								? "✓ Text Recovered Successfully"
								: "✗ Text Recovery Failed"
						}}
					</UBadge>
				</div>
			</div>

			<div class="border-t pt-4">
				<h3 class="text-base font-semibold mb-3">Statistics</h3>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div class="bg-gray-50 dark:bg-gray-800 p-3 rounded">
						<div class="text-xs text-gray-500 mb-1">
							Total Blocks
						</div>
						<div class="text-lg font-semibold">
							{{ statistics.totalBlocks }}
						</div>
					</div>
					<div class="bg-gray-50 dark:bg-gray-800 p-3 rounded">
						<div class="text-xs text-gray-500 mb-1">
							Original Bits
						</div>
						<div class="text-lg font-semibold">
							{{ statistics.totalBitsOriginal }}
						</div>
					</div>
					<div class="bg-gray-50 dark:bg-gray-800 p-3 rounded">
						<div class="text-xs text-gray-500 mb-1">
							Encoded Bits
						</div>
						<div class="text-lg font-semibold">
							{{ statistics.totalBitsEncoded }}
						</div>
					</div>
					<div class="bg-gray-50 dark:bg-gray-800 p-3 rounded">
						<div class="text-xs text-gray-500 mb-1">Overhead</div>
						<div class="text-lg font-semibold">
							{{ statistics.overhead }}%
						</div>
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>
