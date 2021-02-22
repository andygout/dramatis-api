import { getDuplicateEntityIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { Company, Person, Material } from '.';
import { CREDIT_TYPES } from '../utils/constants';

export default class WritingCredit extends Base {

	constructor (props = {}) {

		super(props);

		const { creditType, writingEntities } = props;

		this.model = 'writingCredit';
		this.creditType = CREDIT_TYPES[creditType] || null;

		this.writingEntities = writingEntities
			? writingEntities.map(writingEntity => {
				switch (writingEntity.model) {
					case 'company':
						return new Company(writingEntity);
					case 'material':
						return new Material({ ...writingEntity, isAssociation: true });
					default:
						return new Person(writingEntity);
				}
			})
			: [];

	}

	runInputValidations (opts) {

		this.validateName({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		const duplicateWritingEntityIndices = getDuplicateEntityIndices(this.writingEntities);

		this.writingEntities.forEach((writingEntity, index) => {

			writingEntity.validateName({ isRequired: false });

			writingEntity.validateDifferentiator();

			writingEntity.validateUniquenessInGroup({ isDuplicate: duplicateWritingEntityIndices.includes(index) });

			if (writingEntity.model === 'material') {

				writingEntity.validateNoAssociationWithSelf(opts.subject.name, opts.subject.differentiator);

			}

		});

	}

}
