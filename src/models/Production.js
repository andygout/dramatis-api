import { getDuplicateBaseInstanceIndices, getDuplicateNameIndices } from '../lib/get-duplicate-indices';
import { isValidDate } from '../lib/is-valid-date';
import Base from './Base';
import { CastMember, CreativeCredit, CrewCredit, Material, ProducerCredit, Venue } from '.';

export default class Production extends Base {

	constructor (props = {}) {

		super(props);

		const {
			uuid,
			startDate,
			pressDate,
			endDate,
			material,
			venue,
			producerCredits,
			cast,
			creativeCredits,
			crewCredits
		} = props;

		this.uuid = uuid;

		this.startDate = startDate?.trim() || '';

		this.pressDate = pressDate?.trim() || '';

		this.endDate = endDate?.trim() || '';

		this.material = new Material({ ...material, isAssociation: true });

		this.venue = new Venue({ ...venue, isAssociation: true });

		this.producerCredits = producerCredits
			? producerCredits.map(producerCredit => new ProducerCredit(producerCredit))
			: [];

		this.cast = cast
			? cast.map(castMember => new CastMember(castMember))
			: [];

		this.creativeCredits = creativeCredits
			? creativeCredits.map(creativeCredit => new CreativeCredit(creativeCredit))
			: [];

		this.crewCredits = crewCredits
			? crewCredits.map(crewCredit => new CrewCredit(crewCredit))
			: [];

	}

	get model () {

		return 'production';

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDates();

		this.material.validateName({ isRequired: false });

		this.material.validateDifferentiator();

		this.venue.validateName({ isRequired: false });

		this.venue.validateDifferentiator();

		const duplicateProducerCreditIndices = getDuplicateNameIndices(this.producerCredits);

		this.producerCredits.forEach((producerCredit, index) =>
			producerCredit.runInputValidations({ isDuplicate: duplicateProducerCreditIndices.includes(index) })
		);

		const duplicateCastMemberIndices = getDuplicateBaseInstanceIndices(this.cast);

		this.cast.forEach((castMember, index) =>
			castMember.runInputValidations({ isDuplicate: duplicateCastMemberIndices.includes(index) })
		);

		const duplicateCreativeCreditIndices = getDuplicateNameIndices(this.creativeCredits);

		this.creativeCredits.forEach((creativeCredit, index) =>
			creativeCredit.runInputValidations({ isDuplicate: duplicateCreativeCreditIndices.includes(index) })
		);

		const duplicateCrewCreditIndices = getDuplicateNameIndices(this.crewCredits);

		this.crewCredits.forEach((crewCredit, index) =>
			crewCredit.runInputValidations({ isDuplicate: duplicateCrewCreditIndices.includes(index) })
		);

	}

	validateDates () {

		const formatErrorText = 'Value needs to be in date format';

		if (Boolean(this.startDate) && !isValidDate(this.startDate))
			this.addPropertyError('startDate', formatErrorText);

		if (Boolean(this.pressDate) && !isValidDate(this.pressDate))
			this.addPropertyError('pressDate', formatErrorText);

		if (Boolean(this.endDate) && !isValidDate(this.endDate))
			this.addPropertyError('endDate', formatErrorText);

		if (isValidDate(this.startDate) && isValidDate(this.endDate) && this.startDate > this.endDate) {

			this.addPropertyError('startDate', 'Start date must not be after end date');
			this.addPropertyError('endDate', 'End date must not be before start date');

		}

		if (isValidDate(this.startDate) && isValidDate(this.pressDate) && this.startDate > this.pressDate) {

			this.addPropertyError('startDate', 'Start date must not be after press date');
			this.addPropertyError('pressDate', 'Press date must not be before start date');

		}

		if (isValidDate(this.pressDate) && isValidDate(this.endDate) && this.pressDate > this.endDate) {

			this.addPropertyError('pressDate', 'Press date must not be after end date');
			this.addPropertyError('endDate', 'End date must not be before press date');

		}

	}

	// Overrides Base model runDatabaseValidations() method because Production instances
	// do not require database validation as they can have the same name as others.
	runDatabaseValidations () {

		return;

	}

}
