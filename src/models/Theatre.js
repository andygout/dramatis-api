import { getDuplicateBaseInstanceIndices } from '../lib/get-duplicate-indices';
import Base from './Base';

export default class Theatre extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, subTheatres, isAssociation } = props;

		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

		if (!isAssociation) {

			this.subTheatres = subTheatres
				? subTheatres.map(subTheatre => new this.constructor({ ...subTheatre, isAssociation: true }))
				: [];

		}

	}

	get model () {

		return 'theatre';

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		if (Object.prototype.hasOwnProperty.call(this, 'subTheatres')) {

			const duplicateSubTheatreIndices = getDuplicateBaseInstanceIndices(this.subTheatres);

			this.subTheatres.forEach((subTheatre, index) => {

				subTheatre.validateName({ isRequired: false });

				subTheatre.validateDifferentiator();

				subTheatre.validateNoAssociationWithSelf(this.name, this.differentiator);

				subTheatre.validateUniquenessInGroup({ isDuplicate: duplicateSubTheatreIndices.includes(index) });

			});

		}

	}

}
