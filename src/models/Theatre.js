import { getDuplicateBaseInstanceIndices } from '../lib/get-duplicate-base-instance-indices';
import Base from './Base';

export default class Theatre extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, subTheatres, isAssociation } = props;

		this.model = 'theatre';
		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

		if (!isAssociation) {

			this.subTheatres = subTheatres
				? subTheatres.map(subTheatre => new this.constructor({ ...subTheatre, isAssociation: true }))
				: [];

		}

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		if (Object.prototype.hasOwnProperty.call(this, 'subTheatres')) {

			const duplicateSubTheatreIndices = getDuplicateBaseInstanceIndices(this.subTheatres);

			this.subTheatres.forEach((subTheatre, index) => {

				subTheatre.validateName({ isRequired: false });

				subTheatre.validateDifferentiator();

				subTheatre.validateNotSubTheatreOfSelf(this.name, this.differentiator);

				subTheatre.validateUniquenessInGroup({ isDuplicate: duplicateSubTheatreIndices.includes(index) });

			});

		}

	}

	validateNotSubTheatreOfSelf (surTheatreName, surTheatreDifferentiator) {

		if (!!surTheatreName.length && this.name === surTheatreName && this.differentiator === surTheatreDifferentiator) {

			this.addPropertyError('name', 'Theatre cannot assign iself as one of its sub-theatres');

			this.addPropertyError('differentiator', 'Theatre cannot assign iself as one of its sub-theatres');

		}

	}

}
