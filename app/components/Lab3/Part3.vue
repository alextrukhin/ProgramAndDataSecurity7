<script setup lang="ts">
const inputA = ref(35);
const inputB = ref(21);

interface Step {
	stepNumber: number;
	a: number;
	b: number;
	quotient: number;
	remainder: number;
	isZero: boolean;
	reassignment: string;
}

const euclideanAlgorithm = computed(() => {
	let a = Math.abs(inputA.value);
	let b = Math.abs(inputB.value);

	if (a === 0 && b === 0) {
		return { gcd: 0, steps: [], areCoprime: false };
	}

	if (b === 0) {
		return { gcd: a, steps: [], areCoprime: a === 1 };
	}

	if (a < b) {
		[a, b] = [b, a];
	}

	const steps: Step[] = [];
	let stepNumber = 1;

	while (b !== 0) {
		const quotient = Math.floor(a / b);
		const remainder = a % b;
		const isZero = remainder === 0;

		steps.push({
			stepNumber,
			a,
			b,
			quotient,
			remainder,
			isZero,
			reassignment: isZero
				? `GCD = b = ${b}`
				: `a = ${b}, b = ${remainder}`,
		});

		a = b;
		b = remainder;
		stepNumber++;
	}

	const gcd = a;
	const areCoprime = gcd === 1;

	return { gcd, steps, areCoprime };
});

const result = computed(() => euclideanAlgorithm.value.gcd);

const coprimeMessage = computed(() => {
	const { areCoprime, gcd } = euclideanAlgorithm.value;
	const a = inputA.value;
	const b = inputB.value;

	if (areCoprime) {
		return `Since GCD(${a}, ${b}) = 1, the numbers ${a} and ${b} are coprime (mutually prime).`;
	}
	return `Since GCD(${a}, ${b}) = ${gcd} ≠ 1, the numbers ${a} and ${b} are NOT coprime.`;
});
</script>

<template>
	<UCard>
		<template #header>
			<h2 class="text-lg font-semibold">
				Task 3: Euclidean Algorithm (GCD)
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
						Number b
					</label>
					<UInput v-model="inputB" type="number" />
				</div>
			</div>

			<div>
				<label class="block text-sm font-medium mb-1">
					Greatest Common Divisor (GCD)
				</label>
				<UInput :model-value="result" readonly />
			</div>

			<div>
				<p
					class="text-sm font-medium"
					:class="
						euclideanAlgorithm.areCoprime
							? 'text-green-600 dark:text-green-400'
							: 'text-gray-600 dark:text-gray-400'
					"
				>
					{{ coprimeMessage }}
				</p>
			</div>

			<div class="space-y-2">
				<h3 class="text-base font-semibold">Algorithm Steps</h3>
				<div class="overflow-x-auto">
					<table class="w-full text-sm border-collapse">
						<thead>
							<tr
								class="border-b border-gray-300 dark:border-gray-700"
							>
								<th class="text-left p-2">Step</th>
								<th class="text-left p-2">a</th>
								<th class="text-left p-2">b</th>
								<th class="text-left p-2">a =</th>
								<th class="text-left p-2">q*b</th>
								<th class="text-left p-2">+ r</th>
								<th class="text-left p-2">r = 0</th>
								<th class="text-left p-2">Reassignment</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="step in euclideanAlgorithm.steps"
								:key="step.stepNumber"
								class="border-b border-gray-200 dark:border-gray-800"
							>
								<td class="p-2">{{ step.stepNumber }}</td>
								<td class="p-2">{{ step.a }}</td>
								<td class="p-2">{{ step.b }}</td>
								<td class="p-2">{{ step.a }} =</td>
								<td class="p-2">
									{{ step.quotient }}*{{ step.b }}
								</td>
								<td class="p-2">+ {{ step.remainder }}</td>
								<td class="p-2">
									{{ step.isZero ? "yes" : "no" }}
								</td>
								<td class="p-2 font-mono text-xs">
									{{ step.reassignment }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div class="space-y-2">
				<h3 class="text-base font-semibold">Formula</h3>
				<code
					class="block bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
				>
					GCD({{ inputA }}, {{ inputB }}) = {{ result }}
				</code>
			</div>
		</div>
	</UCard>
</template>
