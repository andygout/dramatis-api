export const getDuplicateIndices = arrayOfObjects => {

	return arrayOfObjects.reduce((accumulator, object, index) => {

		const isDuplicate =
			object.name.length &&
			arrayOfObjects.find((comparisonObject, comparisonIndex) =>
				object.name === comparisonObject.name &&
				object.differentiator === comparisonObject.differentiator &&
				object.qualifier === comparisonObject.qualifier &&
				object.group === comparisonObject.group &&
				index !== comparisonIndex
			);

		if (isDuplicate) accumulator.push(index);

		return accumulator;

	}, []);

};
