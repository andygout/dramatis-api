const getDuplicateIndices = (arrayOfObjects, propertiesToCompare) => {
	return arrayOfObjects.reduce((accumulator, object, index) => {
		const isDuplicate =
			Boolean(object[propertiesToCompare[0]]) &&
			arrayOfObjects.find(
				(comparisonObject, comparisonIndex) =>
					index !== comparisonIndex &&
					propertiesToCompare.every((property) => object[property] === comparisonObject[property])
			);

		if (isDuplicate) accumulator.push(index);

		return accumulator;
	}, []);
};

const getDuplicateBaseInstanceIndices = (arrayOfObjects) => {
	return getDuplicateIndices(arrayOfObjects, ['name', 'differentiator']);
};

const isDuplicateCharacterName = (object, comparisonObject) => {
	const objectUnderlyingName = object.underlyingName.length ? object.underlyingName : object.name;

	const comparisonObjectUnderlyingName = comparisonObject.underlyingName.length
		? comparisonObject.underlyingName
		: comparisonObject.name;

	return object.name === comparisonObject.name || objectUnderlyingName === comparisonObjectUnderlyingName;
};

const getDuplicateCharacterIndices = (arrayOfObjects) => {
	return arrayOfObjects.reduce((accumulator, object, index) => {
		const isDuplicate =
			Boolean(object.name) &&
			arrayOfObjects.find(
				(comparisonObject, comparisonIndex) =>
					index !== comparisonIndex &&
					isDuplicateCharacterName(object, comparisonObject) &&
					object.differentiator === comparisonObject.differentiator &&
					object.qualifier === comparisonObject.qualifier
			);

		if (isDuplicate) accumulator.push(index);

		return accumulator;
	}, []);
};

const getDuplicateEntityIndices = (arrayOfObjects) => {
	return getDuplicateIndices(arrayOfObjects, ['name', 'model', 'differentiator']);
};

const getDuplicateNameIndices = (arrayOfObjects) => {
	return getDuplicateIndices(arrayOfObjects, ['name']);
};

const isDuplicateRoleName = (object, comparisonObject) => {
	const objectCharacterName = object.characterName.length ? object.characterName : object.name;

	const comparisonObjectCharacterName = comparisonObject.characterName.length
		? comparisonObject.characterName
		: comparisonObject.name;

	return object.name === comparisonObject.name || objectCharacterName === comparisonObjectCharacterName;
};

const getDuplicateRoleIndices = (arrayOfObjects) => {
	return arrayOfObjects.reduce((accumulator, object, index) => {
		const isDuplicate =
			Boolean(object.name) &&
			arrayOfObjects.find(
				(comparisonObject, comparisonIndex) =>
					index !== comparisonIndex &&
					isDuplicateRoleName(object, comparisonObject) &&
					object.characterDifferentiator === comparisonObject.characterDifferentiator &&
					object.qualifier === comparisonObject.qualifier
			);

		if (isDuplicate) accumulator.push(index);

		return accumulator;
	}, []);
};

const getDuplicateSettingIndices = (arrayOfObjects) => {
	return arrayOfObjects.reduce((accumulator, object, index) => {
		const isDuplicate =
			Boolean(object.time.name) &&
			Boolean(object.place.name) &&
			Boolean(object.locale.name) &&
			arrayOfObjects.find(
				(comparisonObject, comparisonIndex) =>
					index !== comparisonIndex &&
					object.time.name === comparisonObject.time.name &&
					object.time.differentiator === comparisonObject.time.differentiator &&
					object.place.name === comparisonObject.place.name &&
					object.place.differentiator === comparisonObject.place.differentiator &&
					object.locale.name === comparisonObject.locale.name &&
					object.locale.differentiator === comparisonObject.locale.differentiator
			);

		if (isDuplicate) accumulator.push(index);

		return accumulator;
	}, []);
};

const getDuplicateUrlIndices = (arrayOfObjects) => {
	return getDuplicateIndices(arrayOfObjects, ['url']);
};

const getDuplicateUuidIndices = (arrayOfObjects) => {
	return getDuplicateIndices(arrayOfObjects, ['uuid']);
};

export {
	getDuplicateBaseInstanceIndices,
	getDuplicateCharacterIndices,
	getDuplicateEntityIndices,
	getDuplicateNameIndices,
	getDuplicateRoleIndices,
	getDuplicateSettingIndices,
	getDuplicateUrlIndices,
	getDuplicateUuidIndices
};
