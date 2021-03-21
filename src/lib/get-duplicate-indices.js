const getDuplicateBaseInstanceIndices = arrayOfObjects => {

	return arrayOfObjects.reduce((accumulator, object, index) => {

		const isDuplicate =
			!!object.name.length &&
			arrayOfObjects.find((comparisonObject, comparisonIndex) =>
				index !== comparisonIndex &&
				object.name === comparisonObject.name &&
				object.differentiator === comparisonObject.differentiator
			);

		if (isDuplicate) accumulator.push(index);

		return accumulator;

	}, []);

};

const isDuplicateCharacterName = (object, comparisonObject) => {

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

const getDuplicateCharacterIndices = arrayOfObjects => {

	return arrayOfObjects.reduce((accumulator, object, index) => {

		const isDuplicate =
			!!object.name.length &&
			arrayOfObjects.find((comparisonObject, comparisonIndex) =>
				index !== comparisonIndex &&
				isDuplicateCharacterName(object, comparisonObject) &&
				object.differentiator === comparisonObject.differentiator &&
				object.qualifier === comparisonObject.qualifier
			);

		if (isDuplicate) accumulator.push(index);

		return accumulator;

	}, []);

};

const getDuplicateEntityIndices = arrayOfObjects => {

	return arrayOfObjects.reduce((accumulator, object, index) => {

		const isDuplicate =
			!!object.name.length &&
			arrayOfObjects.find((comparisonObject, comparisonIndex) =>
				index !== comparisonIndex &&
				object.model === comparisonObject.model &&
				object.name === comparisonObject.name &&
				object.differentiator === comparisonObject.differentiator
			);

		if (isDuplicate) accumulator.push(index);

		return accumulator;

	}, []);

};

const getDuplicateNameIndices = arrayOfObjects => {

	return arrayOfObjects.reduce((accumulator, object, index) => {

		const isDuplicate =
			!!object.name.length &&
			arrayOfObjects.find((comparisonObject, comparisonIndex) =>
				index !== comparisonIndex &&
				object.name === comparisonObject.name
			);

		if (isDuplicate) accumulator.push(index);

		return accumulator;

	}, []);

};

const isDuplicateRoleName = (object, comparisonObject) => {

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

const getDuplicateRoleIndices = arrayOfObjects => {

	return arrayOfObjects.reduce((accumulator, object, index) => {

		const isDuplicate =
			!!object.name.length &&
			arrayOfObjects.find((comparisonObject, comparisonIndex) =>
				index !== comparisonIndex &&
				isDuplicateRoleName(object, comparisonObject) &&
				object.characterDifferentiator === comparisonObject.characterDifferentiator &&
				object.qualifier === comparisonObject.qualifier
			);

		if (isDuplicate) accumulator.push(index);

		return accumulator;

	}, []);

};

export {
	getDuplicateBaseInstanceIndices,
	getDuplicateCharacterIndices,
	getDuplicateEntityIndices,
	getDuplicateNameIndices,
	getDuplicateRoleIndices
};
