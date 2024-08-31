import * as stubUuidCounterClient from './stub-uuid-counter-client.js';
import * as stubUuidToCountMapClient from './stub-uuid-to-count-map-client.js';

const constructStubUuid = components => {

	const stubUuidBase =
		components
			.filter(Boolean)
			.map(component =>
				component
					.replaceAll(' — ', ' ') // Replace whitespace-flanked em dash with single whitespace.
					.replaceAll(' & ', ' ')
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

export default (arg = {}) => {

	if (typeof stubUuidCounterClient.getValue() === 'number') {

		return stubUuidCounterClient.incrementValue().toString();

	}

	const { model, name, differentiator } = arg;

	let stubUuid = constructStubUuid([name, differentiator, model]);

	if (differentiator === undefined) {

		const countValue =
			stubUuidToCountMapClient.get(stubUuid)
				? stubUuidToCountMapClient.get(stubUuid) + 1
				: 1;

		stubUuidToCountMapClient.set(stubUuid, countValue);

		if (stubUuidToCountMapClient.get(stubUuid) > 1) {

			stubUuid = constructStubUuid([name, stubUuidToCountMapClient.get(stubUuid).toString(), model]);

		}

	}

	return stubUuid;

};
