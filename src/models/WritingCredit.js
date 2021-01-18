import { getDuplicateWritingEntityIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { Person, Material } from '.';
import { CREDIT_TYPES } from '../utils/constants';

export default class WritingCredit extends Base {

	constructor (props = {}) {

		super(props);

		const { creditType, writingEntities } = props;

		this.model = 'writingCredit';
		this.creditType = CREDIT_TYPES[creditType] || null;

		this.writingEntities = writingEntities
			? writingEntities.map(writingEntity => {
				return writingEntity.model === 'material'
					? new Material({ ...writingEntity, isAssociation: true })
					: new Person(writingEntity);
			})
			: [];

	}

	runInputValidations (opts) {

		this.validateName({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		const duplicateWriterIndices = getDuplicateWritingEntityIndices(this.writingEntities);

		this.writingEntities.forEach((writingEntity, index) => {

			writingEntity.validateName({ isRequired: false });

			writingEntity.validateDifferentiator();

			if (writingEntity.model === 'material') {

				writingEntity.validateNoAssociationWithSelf(opts.subject.name, opts.subject.differentiator);

			}

			writingEntity.validateUniquenessInGroup({ isDuplicate: duplicateWriterIndices.includes(index) });

		});

	}

}
