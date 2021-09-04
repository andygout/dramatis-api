import { getDuplicateBaseInstanceIndices } from '../lib/get-duplicate-indices';
import VenueBase from './VenueBase';

export default class Venue extends VenueBase {

	constructor (props = {}) {

		super(props);

		const { subVenues } = props;

		this.subVenues = subVenues
			? subVenues.map(subVenue => new VenueBase(subVenue))
			: [];

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		const duplicateSubVenueIndices = getDuplicateBaseInstanceIndices(this.subVenues);

		this.subVenues.forEach((subVenue, index) => {

			subVenue.validateName({ isRequired: false });

			subVenue.validateDifferentiator();

			subVenue.validateNoAssociationWithSelf(this.name, this.differentiator);

			subVenue.validateUniquenessInGroup({ isDuplicate: duplicateSubVenueIndices.includes(index) });

		});

	}

}
