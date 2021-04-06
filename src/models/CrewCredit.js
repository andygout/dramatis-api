import { getDuplicateEntities, isEntityInArray } from '../lib/get-duplicate-entity-info';
import Base from './Base';
import { Company, Person } from '.';

export default class CrewCredit extends Base {

	constructor (props = {}) {

		super(props);

		const { crewEntities } = props;

		this.crewEntities = crewEntities
			? crewEntities.map(crewEntity => {
				switch (crewEntity.model) {
					case 'company':
						return new Company({ ...crewEntity, isProductionAssociation: true });
					default:
						return new Person(crewEntity);
				}
			})
			: [];

	}

	get model () {

		return 'crewCredit';

	}

	runInputValidations (opts) {

		this.validateName({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		this.validateNamePresenceIfNamedChildren(this.crewEntities);

		const duplicateCrewEntities = getDuplicateEntities(this.crewEntities);

		this.crewEntities.forEach(crewEntity => {

			crewEntity.validateName({ isRequired: false });

			crewEntity.validateDifferentiator();

			crewEntity.validateUniquenessInGroup({
				isDuplicate: isEntityInArray(crewEntity, duplicateCrewEntities)
			});

			if (crewEntity.model === 'company') {

				crewEntity.validateNamePresenceIfNamedChildren(crewEntity.creditedMembers);

				crewEntity.creditedMembers.forEach(creditedMember => {

					creditedMember.validateName({ isRequired: false });

					creditedMember.validateDifferentiator();

					creditedMember.validateUniquenessInGroup(
						{ isDuplicate: isEntityInArray(creditedMember, duplicateCrewEntities) }
					);

				});

			}

		});

	}

}
