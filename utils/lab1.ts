export const getParityBitsIndexes = (
	length: number,
	mode: "encode" | "decode"
) => {
	// 1, 2, 3, 4, 5, 6, 7, 8, 9...
	const nums = Array.from({ length }, (_, i) => i + 1);
	// 1, 10, 11, 100, 101, 110, 111, 1000, 1001...
	const numsBin = nums.map((e) => Number(e).toString(2));

	// 1, 2, 4, 8...
	const parityBits: number[] = [];
	for (let i = 0; i < numsBin.length; i++) {
		const amountOfOnes = numsBin[i]!.split("").filter(
			(c) => c === "1"
		).length;
		if (amountOfOnes === 1) {
			parityBits.push(nums[i]!);
			if (mode === "encode") {
				nums.push(nums[nums.length - 1]! + 1);
				numsBin.push(nums[nums.length - 1]!.toString(2));
			}
		}
	}

	return parityBits.map((e) => e - 1);
};

export const HammingCodeEncode = (input: string, shouldReverse = true) => {
	// reverse true for Wiki: https://en.wikipedia.org/wiki/Hamming_code#General_algorithm
	// reverse false for other sources like lab, https://www.geeksforgeeks.org/computer-networks/hamming-code-in-computer-network/, https://www.simplilearn.com/tutorials/networking-tutorial/what-is-hamming-code-technique-to-detect-errors-correct-data
	const inputArray = input.split("");
	let output = "";

	// 1, 2, 3, 4, 5, 6, 7, 8, 9...
	const nums = Array.from({ length: inputArray.length }, (_, i) => i + 1);
	// 1, 10, 11, 100, 101, 110, 111, 1000, 1001...
	const numsBin = nums.map((e) => Number(e).toString(2));

	// 1, 2, 4, 8...
	const parityBits: number[] = [];
	for (let i = 0; i < numsBin.length; i++) {
		const amountOfOnes = numsBin[i]!.split("").filter(
			(c) => c === "1"
		).length;
		if (amountOfOnes === 1) {
			parityBits.push(nums[i]!);
			nums.push(nums[nums.length - 1]! + 1);
			numsBin.push(nums[nums.length - 1]!.toString(2));
		}
	}
	const parityBitsIndexes = parityBits.map((e) => e - 1);

	const finalLength = inputArray.length + parityBits.length;
	for (let i = 0, j = 0, k = 0; i < finalLength; i++) {
		if (i === parityBitsIndexes[j]) {
			output += "P";
			j++;
		} else {
			output +=
				inputArray[shouldReverse ? inputArray.length - 1 - k : k]!;
			k++;
		}
	}

	const outputArray = output.split("");

	const parityBitsValues: number[] = [];
	for (let i = 0; i < parityBits.length; i++) {
		const parityBit = parityBits[i]!;
		const coversBits = nums.filter((_, _numberIndex) => {
			const numBin = numsBin[_numberIndex]!;
			// Parity bit `thisParityBit` covers all bit positions which have the `i+1` least significant bit set
			return numBin[numBin.length - (i + 1)] === "1";
		});

		let amountOfOnes = 0;
		for (const bit of coversBits) {
			// Skip the parity bit itself
			if (bit === parityBit) continue;
			// Check if the bit is 1 in the input
			if (outputArray[bit - 1] === "1") amountOfOnes++;
		}
		const value = amountOfOnes % 2;
		parityBitsValues.push(value);
	}

	const outputArray1 = output.split("");
	for (let i = 0; i < parityBitsIndexes.length; i++) {
		outputArray1[parityBitsIndexes[i]!] = parityBitsValues[i]!.toString();
	}

	return (shouldReverse ? outputArray1.reverse() : outputArray1).join("");
};

export const HammingCodeDecode = (input: string, shouldReverse = true) => {
	const inputArray = input.split("");
	let output = "";

	// 1, 2, 3, 4, 5, 6, 7, 8, 9...
	const nums = Array.from({ length: inputArray.length }, (_, i) => i + 1);
	// 1, 10, 11, 100, 101, 110, 111, 1000, 1001...
	const numsBin = nums.map((e) => Number(e).toString(2));

	// 1, 2, 4, 8...
	const parityBits: number[] = [];
	for (let i = 0; i < numsBin.length; i++) {
		const amountOfOnes = numsBin[i]!.split("").filter(
			(c) => c === "1"
		).length;
		if (amountOfOnes === 1) {
			parityBits.push(nums[i]!);
		}
	}
	const parityBitsIndexes = parityBits.map((e) => e - 1);

	for (let i = 0; i < inputArray.length; i++) {
		if (parityBitsIndexes.includes(i)) {
		} else {
			output +=
				inputArray[shouldReverse ? inputArray.length - 1 - i : i]!;
		}
	}

	return shouldReverse ? output.split("").reverse().join("") : output;
};
export const replaceCharacterAt = (
	str: string,
	index: number,
	character: string
) => {
	return (
		str.slice(0, index) + character + str.slice(index + character.length)
	);
};
export const HammingCodeCorrection = (input: string, shouldReverse = true) => {
	if (typeof input !== "string" || input.match(/[^10]/)) {
		console.error(
			'hamming-code error: input should be binary string, for example "101010"'
		);
		return input;
	}

	const workingInput = shouldReverse
		? input.split("").reverse().join("")
		: input;
	const length = workingInput.length;

	const nums = Array.from({ length }, (_, i) => i + 1);
	const numsBin = nums.map((e) => Number(e).toString(2));

	const parityBits: number[] = [];
	for (let i = 0; i < numsBin.length; i++) {
		const amountOfOnes = numsBin[i]!.split("").filter(
			(c) => c === "1"
		).length;
		if (amountOfOnes === 1) {
			parityBits.push(nums[i]!);
		}
	}

	let errorPosition = 0;
	for (let i = 0; i < parityBits.length; i++) {
		const parityBit = parityBits[i]!;
		const coversBits = nums.filter((_, numberIndex) => {
			const numBin = numsBin[numberIndex]!;
			return numBin[numBin.length - (i + 1)] === "1";
		});

		let amountOfOnes = 0;
		for (const bit of coversBits) {
			if (workingInput[bit - 1] === "1") amountOfOnes++;
		}

		if (amountOfOnes % 2 !== 0) {
			errorPosition += parityBit;
		}
	}

	let correctedArray = workingInput.split("");
	if (errorPosition > 0 && errorPosition <= length) {
		correctedArray[errorPosition - 1] =
			correctedArray[errorPosition - 1] === "1" ? "0" : "1";
	}

	const correctedInput = shouldReverse
		? correctedArray.reverse().join("")
		: correctedArray.join("");
	return HammingCodeDecode(correctedInput, shouldReverse);
};

export const hex2bin = (hex: string) => {
	hex = hex.replace("0x", "").toLowerCase();
	let out = "";
	for (const c of hex) {
		switch (c) {
			case "0":
				out += "0000";
				break;
			case "1":
				out += "0001";
				break;
			case "2":
				out += "0010";
				break;
			case "3":
				out += "0011";
				break;
			case "4":
				out += "0100";
				break;
			case "5":
				out += "0101";
				break;
			case "6":
				out += "0110";
				break;
			case "7":
				out += "0111";
				break;
			case "8":
				out += "1000";
				break;
			case "9":
				out += "1001";
				break;
			case "a":
				out += "1010";
				break;
			case "b":
				out += "1011";
				break;
			case "c":
				out += "1100";
				break;
			case "d":
				out += "1101";
				break;
			case "e":
				out += "1110";
				break;
			case "f":
				out += "1111";
				break;
			default:
				return "";
		}
	}

	return out;
};
