<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui";

const operations: RadioGroupItem[] = [
	{
		label: "+",
		description: "Addition",
		value: "add",
	},
	{
		label: "-",
		description: "Subtraction",
		value: "sub",
	},
	{
		label: "*",
		description: "Multiplication",
		value: "mul",
	},
	{
		label: "/",
		description: "Division",
		value: "div",
	},
	{
		label: "^",
		description: "Power",
		value: "pow",
	},
];

const selectedOperation = ref("add");
const a = ref(5);
const b = ref(4);
const bEnabled = ref(true);
const modulus = ref(7);

const gcd = (a: number, b: number): number => {
	a = Math.abs(a);
	b = Math.abs(b);
	while (b !== 0) {
		const temp = b;
		b = a % b;
		a = temp;
	}
	return a;
};

const simplifyFraction = (num: number, den: number) => {
	const divisor = gcd(num, den);
	return {
		numerator: num / divisor,
		denominator: den / divisor,
	};
};

const result = computed(() => {
	const aVal = a.value;
	const bVal = bEnabled.value ? b.value : 1;
	const m = modulus.value;

	if (m <= 0) return { type: "number", value: 0 };

	let intermediate: number;

	switch (selectedOperation.value) {
		case "add":
			intermediate = aVal + bVal;
			return { type: "number", value: ((intermediate % m) + m) % m };

		case "sub":
			intermediate = aVal - bVal;
			return { type: "number", value: ((intermediate % m) + m) % m };

		case "mul":
			intermediate = aVal * bVal;
			return { type: "number", value: ((intermediate % m) + m) % m };

		case "pow":
			if (!bEnabled.value) return { type: "number", value: aVal % m };
			intermediate = Math.pow(aVal, bVal);
			return { type: "number", value: ((intermediate % m) + m) % m };

		case "div":
			if (!bEnabled.value) return { type: "number", value: aVal % m };
			const bInv = modInverse(bVal, m);
			if (bInv === null) {
				const simplified = simplifyFraction(aVal, bVal);
				return {
					type: "fraction",
					numerator: simplified.numerator,
					denominator: simplified.denominator,
				};
			}
			intermediate = aVal * bInv;
			return { type: "number", value: ((intermediate % m) + m) % m };

		default:
			return { type: "number", value: 0 };
	}
});

const resultDisplay = computed(() => {
	const r = result.value;
	if (r.type === "fraction") {
		return `${r.numerator}/${r.denominator}`;
	}
	return String(r.value ?? 0);
});

const formula = computed(() => {
	const aVal = a.value;
	const bVal = b.value;
	const m = modulus.value;
	const r = result.value;

	switch (selectedOperation.value) {
		case "add":
			if (bEnabled.value) {
				return `${aVal}+${bVal} mod ${m} = mod(${aVal + bVal};${m}) = ${
					r.type === "number" ? r.value : ""
				}`;
			}
			return `${aVal} mod ${m} = mod(${aVal};${m}) = ${
				r.type === "number" ? r.value : ""
			}`;

		case "sub":
			if (bEnabled.value) {
				return `${aVal}-${bVal} mod ${m} = mod(${aVal - bVal};${m}) = ${
					r.type === "number" ? r.value : ""
				}`;
			}
			return `${aVal} mod ${m} = mod(${aVal};${m}) = ${
				r.type === "number" ? r.value : ""
			}`;

		case "mul":
			if (bEnabled.value) {
				return `${aVal}*${bVal} mod ${m} = mod(${aVal * bVal};${m}) = ${
					r.type === "number" ? r.value : ""
				}`;
			}
			return `${aVal} mod ${m} = mod(${aVal};${m}) = ${
				r.type === "number" ? r.value : ""
			}`;

		case "pow":
			if (bEnabled.value) {
				const intermediate = Math.pow(aVal, bVal);
				return `${aVal}^${bVal} mod ${m} = mod(${intermediate};${m}) = ${
					r.type === "number" ? r.value : ""
				}`;
			}
			return `${aVal} mod ${m} = mod(${aVal};${m}) = ${
				r.type === "number" ? r.value : ""
			}`;

		case "div":
			if (bEnabled.value) {
				const bInv = modInverse(bVal, m);
				if (bInv === null && r.type === "fraction") {
					return `${aVal}/${bVal} mod ${m} = ${r.numerator}/${r.denominator}`;
				}
				return `${aVal}/${bVal} mod ${m} = ${aVal} * ${bVal}⁻¹ mod ${m} = ${aVal} * ${bInv} mod ${m} = ${
					r.type === "number" ? r.value : ""
				}`;
			}
			return `${aVal} mod ${m} = mod(${aVal};${m}) = ${
				r.type === "number" ? r.value : ""
			}`;

		default:
			return "";
	}
});

const modInverse = (a: number, m: number) => {
	a = ((a % m) + m) % m;

	for (let x = 1; x < m; x++) {
		if ((a * x) % m === 1) {
			return x;
		}
	}

	return null;
};
</script>

<template>
	<UContainer>
		<div class="relative">
			<UColorModeButton class="absolute top-0 right-0 z-10" />
			<div class="flex flex-col gap-8 py-4">
				<UCard>
					<template #header>
						<h2 class="text-lg font-semibold">
							Lab 2: Mod Calculator
						</h2>
					</template>

					<div class="space-y-6">
						<div>
							<label class="block text-sm font-medium mb-2"
								>Operation</label
							>
							<URadioGroup
								v-model="selectedOperation"
								:items="operations"
							/>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label class="block text-sm font-medium mb-1"
									>a</label
								>
								<UInput v-model="a" type="number" />
							</div>

							<div>
								<label
									class="flex items-center gap-2 text-sm font-medium mb-1"
								>
									<UCheckbox v-model="bEnabled" />
									<span>b</span>
								</label>
								<UInput
									v-model="b"
									type="number"
									:disabled="!bEnabled"
								/>
							</div>

							<div>
								<label class="block text-sm font-medium mb-1"
									>modulus (m)</label
								>
								<UInput v-model="modulus" type="number" />
							</div>
						</div>

						<div>
							<label class="block text-sm font-medium mb-1"
								>Result</label
							>
							<UInput :model-value="resultDisplay" readonly />
						</div>

						<div class="space-y-2">
							<h3 class="text-base font-semibold">Formula</h3>
							<code
								class="block bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
							>
								{{ formula }}
							</code>
						</div>
					</div>
				</UCard>

				<div class="text-center">
					<UButton to="/" variant="outline">Back to Home</UButton>
				</div>
			</div>
		</div>
	</UContainer>
</template>
