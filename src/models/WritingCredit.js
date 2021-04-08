import { getDuplicateEntityIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { Company, Person, Material } from '.';
import { CREDIT_TYPES } from '../utils/constants';

export default class WritingCredit extends Base {

	constructor (props = {}) {

		super(props);

		const { creditType, entities } = props;

		this.creditType = CREDIT_TYPES[creditType] || null;

		this.entities = entities
			? entities.map(entity => {
				switch (entity.model) {
					case 'company':
						return new Company(entity);
					case 'material':
						return new Material({ ...entity, isAssociation: true });
					default:
						return new Person(entity);
				}
			})
			: [];

	}

	get model () {

		return 'writingCredit';

	}

	runInputValidations (opts) {

		this.validateName({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		const duplicateWritingEntityIndices = getDuplicateEntityIndices(this.entities);

		this.entities.forEach((entity, index) => {

			entity.validateName({ isRequired: false });

			entity.validateDifferentiator();

			entity.validateUniquenessInGroup({ isDuplicate: duplicateWritingEntityIndices.includes(index) });

			if (entity.model === 'material') {

				entity.validateNoAssociationWithSelf(opts.subject.name, opts.subject.differentiator);

			}

		});

	}

}
