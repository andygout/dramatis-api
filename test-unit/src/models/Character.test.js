import { expect } from 'chai';

import Character from '../../../src/models/Character';

describe('Character model', () => {

	const createInstance = props => {

		return new Character(props);

	};

	describe('constructor method', () => {

		describe('qualifier property', () => {

			context('instance is subject', () => {

				it('will not assign any value if absent from props', () => {

					const props = { name: 'Esme' };
					const instance = createInstance(props);
					expect(instance).not.to.have.property('characters');

				});

				it('will not assign any value if included in props', () => {

					const props = { name: 'Esme', qualifier: 'younger' };
					const instance = createInstance(props);
					expect(instance).not.to.have.property('qualifier');

				});

			});

			context('instance is not subject, i.e. it is an association of another instance', () => {

				it('assigns empty string if absent from props', () => {

					const props = { name: 'Esme', isAssociation: true };
					const instance = createInstance(props);
					expect(instance.qualifier).to.equal('');

				});

				it('assigns empty string if included in props but value is empty string', () => {

					const props = { name: 'Esme', qualifier: '', isAssociation: true };
					const instance = createInstance(props);
					expect(instance.qualifier).to.equal('');

				});

				it('assigns empty string if included in props but value is whitespace-only string', () => {

					const props = { name: 'Esme', qualifier: ' ', isAssociation: true };
					const instance = createInstance(props);
					expect(instance.qualifier).to.equal('');

				});

				it('assigns value if included in props and value is string with length', () => {

					const props = { name: 'Esme', qualifier: 'younger', isAssociation: true };
					const instance = createInstance(props);
					expect(instance.qualifier).to.equal('younger');

				});

				it('trims value before assigning', () => {

					const props = { name: 'Esme', qualifier: ' younger ', isAssociation: true };
					const instance = createInstance(props);
					expect(instance.qualifier).to.equal('younger');

				});

			});

		});

	});

});
