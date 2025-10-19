<script setup lang="ts">
const inputA = ref(2);
const inputP = ref(7);

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

const gcd = (a: number, b: number) => {
	while (b !== 0) {
		const temp = b;
		b = a % b;
		a = temp;
	}
	return a;
};

const eulerPhi = (n: number) => {
	let result = n;
	for (let i = 2; i * i <= n; i++) {
		if (n % i === 0) {
			while (n % i === 0) {
				n = Math.floor(n / i);
			}
			result = result - Math.floor(result / i);
		}
	}
	if (n > 1) {
		result = result - Math.floor(result / n);
	}
	return result;
};

const modularInverse = computed(() => {
	const a = inputA.value;
	const p = inputP.value;

	if (p <= 0) {
		return {
			inverse: null,
			error: "Modulus p must be greater than 0",
			phi: 0,
			steps: [],
		};
	}

	if (a <= 0 || a >= p) {
		return {
			inverse: null,
			error: `a must be in range (0, ${p})`,
			phi: 0,
			steps: [],
		};
	}

	const gcdValue = gcd(a, p);
	if (gcdValue !== 1) {
		return {
			inverse: null,
			error: `GCD(${a}, ${p}) = ${gcdValue} ≠ 1. Numbers must be coprime!`,
			phi: 0,
			steps: [],
		};
	}

	const phi = eulerPhi(p);
	const exponent = phi - 1;
	const powerResult = modPow(a, exponent, p);
	const inverse = powerResult;

	const verification = (a * inverse) % p;

	const steps = [
		{
			description: "Calculate φ(p)",
			formula: `φ(${p}) = ${phi}`,
		},
		{
			description: "Calculate exponent",
			formula: `φ(${p}) - 1 = ${phi} - 1 = ${exponent}`,
		},
		{
			description: "Calculate a^(φ(p)-1) mod p",
			formula: `${a}^${exponent} mod ${p} = ${powerResult} mod ${p} = ${inverse}`,
		},
		{
			description: "Verification",
			formula: `${a} * ${inverse} mod ${p} = ${
				a * inverse
			} mod ${p} = ${verification}`,
		},
	];

	return {
		inverse,
		error: null,
		phi,
		exponent,
		powerResult,
		verification,
		steps,
	};
});

const resultDisplay = computed(() => {
	if (modularInverse.value.error) {
		return "N/A";
	}
	return modularInverse.value.inverse?.toString() ?? "N/A";
});
</script>

<template>
	<UCard>
		<template #header>
			<h2 class="text-lg font-semibold">
				Task 7: Modular Multiplicative Inverse using Euler's Function
			</h2>
		</template>

		<div class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium mb-1">
						Number a
					</label>
					<UInput v-model="inputA" type="number" />
				</div>

				<div>
					<label class="block text-sm font-medium mb-1">
						Modulus p
					</label>
					<UInput v-model="inputP" type="number" />
				</div>
			</div>

			<div>
				<label class="block text-sm font-medium mb-1">
					a⁻¹ (Modular Inverse)
				</label>
				<UInput
					:model-value="resultDisplay"
					readonly
					:color="modularInverse.error ? 'error' : 'success'"
				/>
			</div>

			<div
				v-if="modularInverse.error"
				class="bg-red-100 dark:bg-red-900 p-3 rounded"
			>
				<p class="text-sm text-red-800 dark:text-red-200">
					Warning: {{ modularInverse.error }}
				</p>
			</div>

			<div v-if="!modularInverse.error" class="space-y-2">
				<h3 class="text-base font-semibold">Calculation Steps</h3>
				<div class="space-y-3">
					<div
						v-for="(step, index) in modularInverse.steps"
						:key="index"
						class="bg-gray-100 dark:bg-gray-800 p-3 rounded"
					>
						<p class="text-sm font-semibold mb-1">
							Step {{ index + 1 }}: {{ step.description }}
						</p>
						<p
							class="text-sm font-mono text-blue-600 dark:text-blue-400"
						>
							{{ step.formula }}
						</p>
					</div>
				</div>
			</div>

			<div v-if="!modularInverse.error" class="space-y-2">
				<h3 class="text-base font-semibold">Formula</h3>
				<code
					class="block bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap"
				>
					{{ inputA }}⁻¹ = {{ inputA }}^(φ({{ inputP }})-1) mod
					{{ inputP }} = {{ inputA }}^{{
						modularInverse.exponent
					}}
					mod {{ inputP }} = {{ modularInverse.inverse }}

					Verification: {{ inputA }} *
					{{ modularInverse.inverse }} mod {{ inputP }} =
					{{ modularInverse.verification }} ✓
				</code>
			</div>
		</div>
	</UCard>
</template>
