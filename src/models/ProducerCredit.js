import { getDuplicateEntities, isEntityInArray } from '../lib/get-duplicate-entity-info';
import Base from './Base';
import { CompanyWithCreditedMembers, Person } from '.';
import { MODELS } from '../utils/constants';

export default class ProducerCredit extends Base {

	constructor (props = {}) {

		super(props);

		const { entities } = props;

		this.entities = entities
			? entities.map(entity => {
				switch (entity.model) {
					case MODELS.COMPANY:
						return new CompanyWithCreditedMembers(entity);
					default:
						return new Person(entity);
				}
			})
			: [];

	}

	get model () {

		return MODELS.PRODUCER_CREDIT;

	}

	runInputValidations (opts) {

		this.validateName({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		const duplicateEntities = getDuplicateEntities(this.entities);

		this.entities.forEach(entity => {

			entity.validateName({ isRequired: false });

			entity.validateDifferentiator();

			entity.validateUniquenessInGroup({ isDuplicate: isEntityInArray(entity, duplicateEntities) });

			if (entity.model === MODELS.COMPANY) entity.runInputValidations({ duplicateEntities });

		});

	}

}
