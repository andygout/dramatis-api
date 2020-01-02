export const getDuplicateNameIndices = arrayOfObjects => {

	return arrayOfObjects.reduce((accumulator, object, index) => {

		const isDuplicate =
			object.name.length &&
			arrayOfObjects.find((comparisonObject, comparisonIndex) =>
				object.name === comparisonObject.name &&
				index !== comparisonIndex
			);

		if (isDuplicate) accumulator.push(index);

		return accumulator;
	}, []);

}
