import { getDuplicateWriterIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { Person, Playtext } from '.';

export default class WriterGroup extends Base {

	constructor (props = {}) {

		super(props);

		const { isOriginalVersionWriter, writers } = props;

		this.model = 'writerGroup';
		this.isOriginalVersionWriter = Boolean(isOriginalVersionWriter) || null;
		this.writers = writers
			? writers.map(writer => {
				return writer.model === 'playtext'
					? new Playtext({ ...writer, isAssociation: true })
					: new Person(writer);
			})
			: [];

	}

	runInputValidations (opts) {

		this.validateName({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		const duplicateWriterIndices = getDuplicateWriterIndices(this.writers);

		this.writers.forEach((writer, index) => {

			writer.validateName({ isRequired: false });

			writer.validateDifferentiator();

			writer.validateUniquenessInGroup({ isDuplicate: duplicateWriterIndices.includes(index) });

		});

	}

}
