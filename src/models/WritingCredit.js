import { getDuplicateWritingEntityIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { Person, Material } from '.';

export default class WritingCredit extends Base {

	constructor (props = {}) {

		super(props);

		const { isOriginalVersionCredit, writingEntities } = props;

		this.model = 'writingCredit';
		this.isOriginalVersionCredit = !!isOriginalVersionCredit || null;
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

			writingEntity.validateUniquenessInGroup({ isDuplicate: duplicateWriterIndices.includes(index) });

		});

	}

}
