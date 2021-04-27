import { getDuplicateBaseInstanceIndices } from '../lib/get-duplicate-indices';
import Base from './Base';

export default class Venue extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, differentiator, subVenues, isAssociation } = props;

		this.uuid = uuid;
		this.differentiator = differentiator?.trim() || '';

		if (!isAssociation) {

			this.subVenues = subVenues
				? subVenues.map(subVenue => new this.constructor({ ...subVenue, isAssociation: true }))
				: [];

		}

	}

	get model () {

		return 'venue';

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		if (Object.prototype.hasOwnProperty.call(this, 'subVenues')) {

			const duplicateSubVenueIndices = getDuplicateBaseInstanceIndices(this.subVenues);

			this.subVenues.forEach((subVenue, index) => {

				subVenue.validateName({ isRequired: false });

				subVenue.validateDifferentiator();

				subVenue.validateNoAssociationWithSelf(this.name, this.differentiator);

				subVenue.validateUniquenessInGroup({ isDuplicate: duplicateSubVenueIndices.includes(index) });

			});

		}

	}

}
