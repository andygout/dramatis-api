const isDuplicateName = (object, comparisonObject) => {

	const objectCharacterName =
		object.characterName.length
			? object.characterName
			: object.name;

	const comparisonObjectCharacterName =
		comparisonObject.characterName.length
			? comparisonObject.characterName
			: comparisonObject.name;

	return object.name === comparisonObject.name || objectCharacterName === comparisonObjectCharacterName;

};

export const getDuplicateRoleIndices = arrayOfObjects => {

	return arrayOfObjects.reduce((accumulator, object, index) => {

		const isDuplicate =
			!!object.name.length &&
			arrayOfObjects.find((comparisonObject, comparisonIndex) =>
				isDuplicateName(object, comparisonObject) &&
				object.characterDifferentiator === comparisonObject.characterDifferentiator &&
				object.qualifier === comparisonObject.qualifier &&
				index !== comparisonIndex
			);

		if (isDuplicate) accumulator.push(index);

		return accumulator;

	}, []);

};
