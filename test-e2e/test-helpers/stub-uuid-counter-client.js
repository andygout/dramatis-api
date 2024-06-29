let stubUuidCounter;

const setValueToZero = () => stubUuidCounter = 0;

const getValue = () => stubUuidCounter;

const incrementValue = () => ++stubUuidCounter;

const setValueToUndefined = () => stubUuidCounter = undefined;

export {
	setValueToZero,
	getValue,
	incrementValue,
	setValueToUndefined
};
