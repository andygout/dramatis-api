const constructStubUuid = components => {

	const stubUuidBase =
		components
			.filter(Boolean)
			.map(component =>
				component
					.replaceAll(' - ', ' ')
					.toUpperCase()
					.split(' ')
					.join('_')
					.replaceAll('-', '_')
					.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
					.replace(/[^A-ZÀ-Ž0-9#_]/g, '')
				)
			.join('_');

	return `${stubUuidBase}_UUID`;

};

export default (arg, stubUuidCounts) => {

	const { model, name, differentiator } = arg;

	let stubUuid = constructStubUuid([name, differentiator, model]);

	if (differentiator === undefined) {

		stubUuidCounts[stubUuid] = stubUuidCounts[stubUuid] ? stubUuidCounts[stubUuid] + 1 : 1;

		if (stubUuidCounts[stubUuid] > 1) {

			stubUuid = constructStubUuid([name, stubUuidCounts[stubUuid].toString(), model]);

		}

	}

	return stubUuid;

};
