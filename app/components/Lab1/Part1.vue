<script setup lang="ts">
import {
	HammingCodeEncode,
	HammingCodeDecode,
	HammingCodeCorrection,
	hex2bin,
	replaceCharacterAt,
	getParityBitsIndexes,
} from "~~/utils/lab1";

const numberInList = ref(11);
const pureText = ref("Trukhin");
const shouldReverse = ref(true);

const asciiCodes = computed(() =>
	pureText.value.split("").map((e) => e.charCodeAt(0))
);

const hexText = computed(() =>
	asciiCodes.value.map((code) => code.toString(16).toUpperCase())
);

const binText = computed(() => hexText.value.map((e) => hex2bin(e)));

const binTextCombined = computed(() => binText.value.join(""));

const parityBitsIndexes = computed(() =>
	getParityBitsIndexes(binTextCombined.value.length, "encode").map(
		(i) => i + 1
	)
);

const hammingCodeEncoded = computed(() =>
	HammingCodeEncode(binTextCombined.value, shouldReverse.value)
);

const hammingCodeWithOneBitError = computed(() => {
	if (
		hammingCodeEncoded.value.length < numberInList.value ||
		numberInList.value <= 0
	) {
		return hammingCodeEncoded.value;
	}
	const indexToBreak = numberInList.value - 1;
	return replaceCharacterAt(
		hammingCodeEncoded.value,
		indexToBreak,
		hammingCodeEncoded.value[indexToBreak] === "0" ? "1" : "0"
	);
});

const hammingCodeCorrectedOneBit = computed(() =>
	HammingCodeCorrection(hammingCodeWithOneBitError.value, shouldReverse.value)
);

const hammingCodeWithTwoBitErrors = computed(() => {
	let result = hammingCodeEncoded.value;
	const n = numberInList.value;

	if (result.length >= n && n > 0) {
		const indexToBreak1 = n - 1;
		result = replaceCharacterAt(
			result,
			indexToBreak1,
			result[indexToBreak1] === "0" ? "1" : "0"
		);
	}

	const secondBitPosition = 35 - n;
	if (result.length >= secondBitPosition && secondBitPosition > 0) {
		const indexToBreak2 = secondBitPosition - 1;
		result = replaceCharacterAt(
			result,
			indexToBreak2,
			result[indexToBreak2] === "0" ? "1" : "0"
		);
	}

	return result;
});

const hammingCodeCorrectedTwoBits = computed(() =>
	HammingCodeCorrection(
		hammingCodeWithTwoBitErrors.value,
		shouldReverse.value
	)
);

const decodedOriginal = computed(() => {
	const decoded = HammingCodeDecode(
		hammingCodeEncoded.value,
		shouldReverse.value
	);
	return binaryToText(decoded);
});

const decodedOneBitError = computed(() =>
	binaryToText(hammingCodeCorrectedOneBit.value)
);
const decodedTwoBitError = computed(() =>
	binaryToText(hammingCodeCorrectedTwoBits.value)
);

function binaryToText(binary: string): string {
	const chars: string[] = [];
	for (let i = 0; i < binary.length; i += 8) {
		const byte = binary.slice(i, i + 8);
		if (byte.length === 8) {
			chars.push(String.fromCharCode(parseInt(byte, 2)));
		}
	}
	return chars.join("");
}

const isOneBitRecoverySuccessful = computed(
	() => decodedOneBitError.value === pureText.value
);

const isTwoBitRecoverySuccessful = computed(
	() => decodedTwoBitError.value === pureText.value
);
</script>
<template>
	<UCard>
		<template #header>
			<h2 class="text-lg font-semibold">
				Task 1: Name Encoding with Hamming Code
			</h2>
		</template>
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium mb-1"
					>Your position number in group (N)</label
				>
				<UInput v-model="numberInList" type="number" />
			</div>
			<div>
				<label class="block text-sm font-medium mb-1"
					>Enter your name (less than 5 letters)</label
				>
				<UInput v-model="pureText" />
			</div>

			<div class="space-y-2">
				<h3 class="text-base font-semibold">Step 1: ASCII Codes</h3>
				<code
					class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
				>
					{{ asciiCodes.join(", ") }}
				</code>
			</div>

			<div class="space-y-2">
				<h3 class="text-base font-semibold">
					Step 2: Hexadecimal Representation
				</h3>
				<code
					class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
				>
					{{ hexText.join(" ") }}
				</code>
			</div>

			<div class="space-y-2">
				<h3 class="text-base font-semibold">
					Step 3: Binary Representation (8 bits per char)
				</h3>
				<code
					class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100 break-all"
				>
					{{ binText.join(" ") }}
				</code>
			</div>

			<div class="space-y-2">
				<h3 class="text-base font-semibold">Step 4: Combined Binary</h3>
				<code
					class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100 break-all"
				>
					{{ binTextCombined }}
				</code>
			</div>

			<div class="space-y-2">
				<h3 class="text-base font-semibold">
					Step 5: Parity Bits Positions
				</h3>
				<code
					class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
				>
					{{ parityBitsIndexes.join(", ") }}
				</code>
			</div>

			<div class="space-y-2">
				<h3 class="text-base font-semibold">
					Step 6: Hamming Code Encoded
				</h3>
				<code
					class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100 break-all"
				>
					{{ hammingCodeEncoded }}
				</code>
				<p class="text-xs text-gray-500">
					Length: {{ hammingCodeEncoded.length }} bits
				</p>
			</div>

			<div class="border-t pt-4 space-y-4">
				<h3 class="text-base font-semibold">
					Test 1: Single Bit Error (Bit N = {{ numberInList }})
				</h3>

				<div class="space-y-2">
					<h4 class="text-sm font-medium">
						Damaged Code (bit {{ numberInList }} flipped):
					</h4>
					<code
						class="block bg-red-50 dark:bg-red-900/20 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100 break-all"
					>
						{{ hammingCodeWithOneBitError }}
					</code>
				</div>

				<div class="space-y-2">
					<h4 class="text-sm font-medium">Corrected Binary:</h4>
					<code
						class="block bg-green-50 dark:bg-green-900/20 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100 break-all"
					>
						{{ hammingCodeCorrectedOneBit }}
					</code>
				</div>

				<div class="space-y-2">
					<h4 class="text-sm font-medium">Decoded Text:</h4>
					<code
						class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
					>
						{{ decodedOneBitError }}
					</code>
					<UBadge
						:color="
							isOneBitRecoverySuccessful ? 'success' : 'error'
						"
					>
						{{
							isOneBitRecoverySuccessful
								? "✓ Recovery Successful"
								: "✗ Recovery Failed"
						}}
					</UBadge>
				</div>
			</div>

			<div class="border-t pt-4 space-y-4">
				<h3 class="text-base font-semibold">
					Test 2: Two Bit Errors (Bits N={{ numberInList }} and
					(35-N)={{ 35 - numberInList }})
				</h3>

				<div class="space-y-2">
					<h4 class="text-sm font-medium">
						Damaged Code (bits {{ numberInList }} and
						{{ 35 - numberInList }} flipped):
					</h4>
					<code
						class="block bg-red-50 dark:bg-red-900/20 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100 break-all"
					>
						{{ hammingCodeWithTwoBitErrors }}
					</code>
				</div>

				<div class="space-y-2">
					<h4 class="text-sm font-medium">
						Attempted Correction Binary:
					</h4>
					<code
						class="block bg-orange-50 dark:bg-orange-900/20 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100 break-all"
					>
						{{ hammingCodeCorrectedTwoBits }}
					</code>
				</div>

				<div class="space-y-2">
					<h4 class="text-sm font-medium">Decoded Text:</h4>
					<code
						class="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
					>
						{{ decodedTwoBitError }}
					</code>
					<UBadge
						:color="
							isTwoBitRecoverySuccessful ? 'success' : 'error'
						"
					>
						{{
							isTwoBitRecoverySuccessful
								? "✓ Recovery Successful"
								: "✗ Recovery Failed - Hamming code cannot correct 2+ bit errors"
						}}
					</UBadge>
				</div>
			</div>
		</div>
	</UCard>
</template>
