import { getDuplicateEntities, isEntityInArray } from '../lib/get-duplicate-entity-info';
import Base from './Base';
import { Company, Person } from '.';

export default class CreativeCredit extends Base {

	constructor (props = {}) {

		super(props);

		const { creativeEntities } = props;

		this.model = 'creativeCredit';

		this.creativeEntities = creativeEntities
			? creativeEntities.map(creativeEntity => {
				switch (creativeEntity.model) {
					case 'company':
						return new Company({ ...creativeEntity, isProductionAssociation: true });
					default:
						return new Person(creativeEntity);
				}
			})
			: [];

	}

	runInputValidations (opts) {

		this.validateName({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		this.validateNamePresenceIfNamedChildren(this.creativeEntities);

		const duplicateCreativeEntities = getDuplicateEntities(this.creativeEntities);

		this.creativeEntities.forEach(creativeEntity => {

			creativeEntity.validateName({ isRequired: false });

			creativeEntity.validateDifferentiator();

			creativeEntity.validateUniquenessInGroup({
				isDuplicate: isEntityInArray(creativeEntity, duplicateCreativeEntities)
			});

			if (creativeEntity.model === 'company') {

				creativeEntity.validateNamePresenceIfNamedChildren(creativeEntity.creditedMembers);

				creativeEntity.creditedMembers.forEach(creditedMember => {

					creditedMember.validateName({ isRequired: false });

					creditedMember.validateDifferentiator();

					creditedMember.validateUniquenessInGroup(
						{ isDuplicate: isEntityInArray(creditedMember, duplicateCreativeEntities) }
					);

				});

			}

		});

	}

}
