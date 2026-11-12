import { SurPlace } from './index.js';
import PlaceBase from './PlaceBase.js';

export default class Place extends PlaceBase {
	constructor(props = {}) {
		super(props);

		const { surPlace } = props;

		this.surPlace = new SurPlace(surPlace);
	}

	runInputValidations() {
		this.validateName({ isRequired: true });

		this.validateDifferentiator();

		this.surPlace.validateName({ isRequired: false });

		this.surPlace.validateDifferentiator();

		this.surPlace.validateNoAssociationWithSelf({
			name: this.name,
			differentiator: this.differentiator
		});
	}

	async runDatabaseValidations() {
		await this.validateUniquenessInDatabase();

		await this.surPlace.runDatabaseValidations({ subjectPlaceUuid: this.uuid });
	}
}
