<script setup lang="ts">
const numberToTest = ref(17);
const upperBound = ref(100);

const modPow = (base: number, exponent: number, modulus: number) => {
	if (modulus === 1) return 0;
	let result = 1;
	base = base % modulus;
	while (exponent > 0) {
		if (exponent % 2 === 1) {
			result = (result * base) % modulus;
		}
		exponent = Math.floor(exponent / 2);
		base = (base * base) % modulus;
	}
	return result;
};

const fermatPrimalityTest = (n: number, iterations = 5) => {
	if (n <= 1) return false;
	if (n <= 3) return true;
	if (n % 2 === 0) return false;

	for (let i = 0; i < iterations; i++) {
		const a = Math.floor(Math.random() * (n - 3)) + 2;
		if (modPow(a, n - 1, n) !== 1) {
			return false;
		}
	}
	return true;
};

const isPrime = computed(() => {
	const n = numberToTest.value;
	if (n <= 1) return { result: false, message: "Not prime (n ≤ 1)" };
	if (n === 2 || n === 3) return { result: true, message: "Prime" };
	if (n % 2 === 0)
		return { result: false, message: "Not prime (even number)" };

	const result = fermatPrimalityTest(n);
	return {
		result,
		message: result
			? "Prime (Fermat test passed)"
			: "Not prime (Fermat test failed)",
	};
});

const generatePrime = computed(() => {
	const limit = upperBound.value;

	if (limit < 2) {
		return { prime: null, message: "No primes less than 2" };
	}

	const candidates: number[] = [];
	for (let i = 2; i <= limit; i++) {
		if (fermatPrimalityTest(i)) {
			candidates.push(i);
		}
	}

	if (candidates.length === 0) {
		return { prime: null, message: "No primes found" };
	}

	return {
		prime: candidates[candidates.length - 1],
		message: `Found ${candidates.length} prime(s) up to ${limit}`,
	};
});
</script>

<template>
	<UCard>
		<template #header>
			<h2 class="text-lg font-semibold">
				Task 1: Fermat Primality Test & Prime Generation
			</h2>
		</template>

		<div class="space-y-6">
			<div class="space-y-4">
				<h3 class="text-base font-semibold">Primality Test</h3>
				<div>
					<label class="block text-sm font-medium mb-1">
						Number to test
					</label>
					<UInput v-model="numberToTest" type="number" />
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">
						Result
					</label>
					<UInput
						:model-value="isPrime.message"
						readonly
						:color="isPrime.result ? 'success' : 'error'"
					/>
				</div>
			</div>

			<UDivider />

			<div class="space-y-4">
				<h3 class="text-base font-semibold">Prime Number Generation</h3>
				<div>
					<label class="block text-sm font-medium mb-1">
						Upper bound (A)
					</label>
					<UInput v-model="upperBound" type="number" />
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">
						Generated prime (p ≤ A)
					</label>
					<UInput
						:model-value="generatePrime.prime ?? 'N/A'"
						readonly
					/>
				</div>
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{{ generatePrime.message }}
				</p>
			</div>
		</div>
	</UCard>
</template>
