<script setup lang="ts">
const inputN = ref(12);

interface FactorStep {
	divisor: number;
	divisionCount: number;
	nAfter: number;
	resultBefore: number;
	resultAfter: number;
	calculation: string;
}

const eulerPhi = computed(() => {
	let n = Math.abs(inputN.value);

	if (n === 0) {
		return { phi: 0, steps: [], coprimeNumbers: [] };
	}

	if (n === 1) {
		return { phi: 1, steps: [], coprimeNumbers: [1] };
	}

	const originalN = n;
	let result = n;
	const steps: FactorStep[] = [];

	for (let i = 2; i * i <= n; i++) {
		if (n % i === 0) {
			let divisionCount = 0;
			const resultBefore = result;

			while (n % i === 0) {
				n = Math.floor(n / i);
				divisionCount++;
			}

			result = result - Math.floor(result / i);

			steps.push({
				divisor: i,
				divisionCount,
				nAfter: n,
				resultBefore,
				resultAfter: result,
				calculation: `${resultBefore} - ${resultBefore}/${i} = ${result}`,
			});
		}
	}

	if (n > 1) {
		const resultBefore = result;
		result = result - Math.floor(result / n);

		steps.push({
			divisor: n,
			divisionCount: 1,
			nAfter: 1,
			resultBefore,
			resultAfter: result,
			calculation: `${resultBefore} - ${resultBefore}/${n} = ${result}`,
		});
	}

	const coprimeNumbers: number[] = [];
	for (let i = 1; i < originalN; i++) {
		if (gcd(i, originalN) === 1) {
			coprimeNumbers.push(i);
		}
	}

	return { phi: result, steps, coprimeNumbers };
});

const gcd = (a: number, b: number): number => {
	while (b !== 0) {
		const temp = b;
		b = a % b;
		a = temp;
	}
	return a;
};

const coprimeList = computed(() => {
	const numbers = eulerPhi.value.coprimeNumbers;
	if (numbers.length === 0) return "None";
	if (numbers.length > 20) {
		return numbers.slice(0, 20).join(", ") + ", ...";
	}
	return numbers.join(", ");
});
</script>

<template>
	<UCard>
		<template #header>
			<h2 class="text-lg font-semibold">
				Task 5: Euler's Totient Function (φ)
			</h2>
		</template>

		<div class="space-y-6">
			<div>
				<label class="block text-sm font-medium mb-1"> Number n </label>
				<UInput v-model="inputN" type="number" />
			</div>

			<div>
				<label class="block text-sm font-medium mb-1">
					φ(n) - Count of coprime numbers
				</label>
				<UInput :model-value="eulerPhi.phi" readonly />
			</div>

			<div class="space-y-2">
				<h3 class="text-base font-semibold">Algorithm Steps</h3>
				<div class="space-y-3">
					<div class="bg-gray-100 dark:bg-gray-800 p-3 rounded">
						<p class="text-sm font-mono">
							Initial: result = n = {{ inputN }}
						</p>
					</div>

					<div
						v-for="(step, index) in eulerPhi.steps"
						:key="index"
						class="bg-gray-100 dark:bg-gray-800 p-3 rounded space-y-1"
					>
						<p class="text-sm">
							<span class="font-semibold"
								>Step {{ index + 1 }}:</span
							>
							Found prime factor
							<span class="font-mono">{{ step.divisor }}</span>
						</p>
						<p
							class="text-sm font-mono text-gray-700 dark:text-gray-300"
						>
							n divided by {{ step.divisor }}
							{{ step.divisionCount }} time(s) → n =
							{{ step.nAfter }}
						</p>
						<p
							class="text-sm font-mono text-blue-600 dark:text-blue-400"
						>
							result = {{ step.calculation }}
						</p>
					</div>

					<div class="bg-green-100 dark:bg-green-900 p-3 rounded">
						<p class="text-sm font-semibold">
							Final result: φ({{ inputN }}) = {{ eulerPhi.phi }}
						</p>
					</div>
				</div>
			</div>

			<div class="space-y-2">
				<h3 class="text-base font-semibold">
					Coprime Numbers ({{ eulerPhi.coprimeNumbers.length }} total)
				</h3>
				<div class="bg-gray-100 dark:bg-gray-800 p-3 rounded">
					<p class="text-sm font-mono break-words">
						{{ coprimeList }}
					</p>
				</div>
				<p class="text-xs text-gray-600 dark:text-gray-400">
					These are the numbers less than {{ inputN }} that are
					coprime (GCD = 1) with {{ inputN }}
				</p>
			</div>

			<div class="space-y-2">
				<h3 class="text-base font-semibold">Formula</h3>
				<code
					class="block bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
				>
					φ({{ inputN }}) = {{ eulerPhi.phi }}
				</code>
			</div>
		</div>
	</UCard>
</template>
