import { getDuplicateEntities, isEntityInArray } from '../lib/get-duplicate-entity-info';
import Base from './Base';
import { Company, Person } from '.';

export default class ProductionTeamCredit extends Base {

	constructor (props = {}) {

		super(props);

		const { entities } = props;

		this.entities = entities
			? entities.map(entity => {
				switch (entity.model) {
					case 'company':
						return new Company({ ...entity, isProductionAssociation: true });
					default:
						return new Person(entity);
				}
			})
			: [];

	}

	runInputValidations (opts) {

		this.validateName({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		this.validateNamePresenceIfNamedChildren(this.entities);

		const duplicateEntities = getDuplicateEntities(this.entities);

		this.entities.forEach(entity => {

			entity.validateName({ isRequired: false });

			entity.validateDifferentiator();

			entity.validateUniquenessInGroup({ isDuplicate: isEntityInArray(entity, duplicateEntities) });

			if (entity.model === 'company') {

				entity.validateNamePresenceIfNamedChildren(entity.creditedMembers);

				entity.creditedMembers.forEach(creditedMember => {

					creditedMember.validateName({ isRequired: false });

					creditedMember.validateDifferentiator();

					creditedMember.validateUniquenessInGroup(
						{ isDuplicate: isEntityInArray(creditedMember, duplicateEntities) }
					);

				});

			}

		});

	}

}