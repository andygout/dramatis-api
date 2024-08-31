import { expect } from 'chai';
import esmock from 'esmock';
import { stub } from 'sinon';

const STRING_MAX_LENGTH = 1000;
const ABOVE_MAX_LENGTH_STRING = 'a'.repeat(STRING_MAX_LENGTH + 1);

describe('Input validation failures: Venue instance', () => {

	let stubs;

	const methods = [
		'create',
		'update'
	];

	beforeEach(() => {

		stubs = {
			neo4jQueryModule: {
				// Stub with a contrived resolution that ensures various
				// neo4jQuery function calls all pass database validation.
				neo4jQuery: stub().resolves({
					isExistent: true,
					isDuplicateRecord: false,
					isAssignedToSurVenue: false,
					isSurVenue: false,
					isSubjectVenueASubVenue: false
				})
			}
		};

	});

	const createSubject = () =>
		esmock(
			'../../src/models/Venue.js',
			{},
			{
				'../../src/neo4j/query.js': stubs.neo4jQueryModule
			}
		);

	context('name value is empty string', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Venue = await createSubject();

				const instance = new Venue({ name: '' });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: '',
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too short'
						]
					},
					subVenues: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Venue = await createSubject();

				const instance = new Venue({ name: ABOVE_MAX_LENGTH_STRING });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: ABOVE_MAX_LENGTH_STRING,
					differentiator: '',
					hasErrors: true,
					errors: {
						name: [
							'Value is too long'
						]
					},
					subVenues: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Venue = await createSubject();

				const instance = new Venue({ name: 'National Theatre', differentiator: ABOVE_MAX_LENGTH_STRING });

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'National Theatre',
					differentiator: ABOVE_MAX_LENGTH_STRING,
					hasErrors: true,
					errors: {
						differentiator: [
							'Value is too long'
						]
					},
					subVenues: []
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('sub-venue name value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Venue = await createSubject();

				const instanceProps = {
					name: 'National Theatre',
					subVenues: [
						{
							name: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Venue(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subVenues: [
						{
							uuid: undefined,
							name: ABOVE_MAX_LENGTH_STRING,
							differentiator: '',
							errors: {
								name: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('sub-venue differentiator value exceeds maximum limit', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Venue = await createSubject();

				const instanceProps = {
					name: 'National Theatre',
					subVenues: [
						{
							name: 'Olivier Theatre',
							differentiator: ABOVE_MAX_LENGTH_STRING
						}
					]
				};

				const instance = new Venue(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subVenues: [
						{
							uuid: undefined,
							name: 'Olivier Theatre',
							differentiator: ABOVE_MAX_LENGTH_STRING,
							errors: {
								differentiator: [
									'Value is too long'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('venue instance assigns itself as a sub-venue', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Venue = await createSubject();

				const instanceProps = {
					name: 'National Theatre',
					subVenues: [
						{
							name: 'National Theatre'
						}
					]
				};

				const instance = new Venue(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subVenues: [
						{
							uuid: undefined,
							name: 'National Theatre',
							differentiator: '',
							errors: {
								name: [
									'Instance cannot form association with itself'
								],
								differentiator: [
									'Instance cannot form association with itself'
								]
							}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

	context('duplicate sub-venues', () => {

		for (const method of methods) {

			it(`assigns appropriate error (${method} method)`, async () => {

				const Venue = await createSubject();

				const instanceProps = {
					name: 'National Theatre',
					subVenues: [
						{
							name: 'Olivier Theatre'
						},
						{
							name: 'Lyttelton Theatre',
							differentiator: '1'
						},
						{
							name: 'Olivier Theatre'
						},
						{
							name: 'Lyttelton Theatre',
							differentiator: '2'
						}
					]
				};

				const instance = new Venue(instanceProps);

				const result = await instance[method]();

				const expectedResponseBody = {
					uuid: undefined,
					name: 'National Theatre',
					differentiator: '',
					hasErrors: true,
					errors: {},
					subVenues: [
						{
							uuid: undefined,
							name: 'Olivier Theatre',
							differentiator: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								]
							}
						},
						{
							uuid: undefined,
							name: 'Lyttelton Theatre',
							differentiator: '1',
							errors: {}
						},
						{
							uuid: undefined,
							name: 'Olivier Theatre',
							differentiator: '',
							errors: {
								name: [
									'This item has been duplicated within the group'
								],
								differentiator: [
									'This item has been duplicated within the group'
								]
							}
						},
						{
							uuid: undefined,
							name: 'Lyttelton Theatre',
							differentiator: '2',
							errors: {}
						}
					]
				};

				expect(result).to.deep.equal(expectedResponseBody);

			});

		}

	});

});
