const getDuplicateEntities = arrayOfEntities => {

	const duplicateEntities = [];

	const pushIntoRequisiteArray = (entity, accumulator) => {

		if (!entity.name.length) return;

		const isEntityInAccumulator = isEntityInArray(entity, accumulator);

		const isEntityInDuplicateEntities = isEntityInArray(entity, duplicateEntities);

		if (!isEntityInAccumulator) accumulator.push(entity);

		if (isEntityInAccumulator && !isEntityInDuplicateEntities) duplicateEntities.push(entity);

		return;

	};

	arrayOfEntities.reduce((accumulator, entity) => {

		Object.prototype.hasOwnProperty.call(entity, 'creditedMembers') &&
		entity.creditedMembers.forEach(nestedEntity => pushIntoRequisiteArray(nestedEntity, accumulator));

		pushIntoRequisiteArray(entity, accumulator);

		return accumulator;

	}, []);

	return duplicateEntities;

};

const isEntityInArray = (entity, array) => {

	const foundEntity =
		Boolean(entity.name) &&
		array.find(comparisonEntity =>
			entity.name === comparisonEntity.name &&
			entity.differentiator === comparisonEntity.differentiator &&
			entity.model === comparisonEntity.model
		);

	return Boolean(foundEntity);

};

export {
	getDuplicateEntities,
	isEntityInArray
};
