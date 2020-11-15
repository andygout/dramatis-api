const isDuplicateName = (object, comparisonObject) => {

	const objectUnderlyingName =
		object.underlyingName.length
			? object.underlyingName
			: object.name;

	const comparisonObjectUnderlyingName =
		comparisonObject.underlyingName.length
			? comparisonObject.underlyingName
			: comparisonObject.name;

	return object.name === comparisonObject.name || objectUnderlyingName === comparisonObjectUnderlyingName;

};

export const getDuplicateCharacterIndices = arrayOfObjects => {

	return arrayOfObjects.reduce((accumulator, object, index) => {

		const isDuplicate =
			!!object.name.length &&
			arrayOfObjects.find((comparisonObject, comparisonIndex) =>
				isDuplicateName(object, comparisonObject) &&
				object.differentiator === comparisonObject.differentiator &&
				object.qualifier === comparisonObject.qualifier &&
				index !== comparisonIndex
			);

		if (isDuplicate) accumulator.push(index);

		return accumulator;

	}, []);

};
