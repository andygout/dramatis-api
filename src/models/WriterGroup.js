import { getDuplicateBaseInstanceIndices } from '../lib/get-duplicate-base-instance-indices';
import Base from './Base';
import { Person } from '.';

export default class WriterGroup extends Base {

	constructor (props = {}) {

		super(props);

		const { writers } = props;

		this.model = 'writerGroup';
		this.writers = writers
			? writers.map(writer => new Person(writer))
			: [];

	}

	runInputValidations (opts) {

		this.validateName({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		const duplicateWriterIndices = getDuplicateBaseInstanceIndices(this.writers);

		this.writers.forEach((writer, index) => {

			writer.validateName({ isRequired: false });

			writer.validateDifferentiator();

			writer.validateUniquenessInGroup({ isDuplicate: duplicateWriterIndices.includes(index) });

		});

	}

}
