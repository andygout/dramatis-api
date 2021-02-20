import { getDuplicateEntityIndices } from '../lib/get-duplicate-indices';
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

		const duplicateCreativeEntityIndices = getDuplicateEntityIndices(this.creativeEntities);

		this.creativeEntities.forEach((creativeEntity, index) => {

			creativeEntity.validateName({ isRequired: false });

			creativeEntity.validateDifferentiator();

			creativeEntity.validateUniquenessInGroup({ isDuplicate: duplicateCreativeEntityIndices.includes(index) });

		});

	}

}
