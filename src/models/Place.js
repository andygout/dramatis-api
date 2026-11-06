import PlaceBase from './PlaceBase.js';
import { getTrimmedOrEmptyString } from '../lib/strings.js';

export default class Place extends PlaceBase {
	constructor(props = {}) {
		super(props);

		const { geometryWkt } = props;

		this.geometryWkt = getTrimmedOrEmptyString(geometryWkt);
	}

	runInputValidations() {
		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		// this.validateGeometryWkt();
	}

	// TODO: Populate this function.
	// validateGeometryWkt() {

	// }
}
