import {
	getDuplicateBaseInstanceIndices,
	getDuplicateNameIndices,
	getDuplicateProductionIdentifierIndices
} from '../lib/get-duplicate-indices';
import { isValidDate } from '../lib/is-valid-date';
import Entity from './Entity';
import {
	CastMember,
	CreativeCredit,
	CrewCredit,
	MaterialBase,
	ProducerCredit,
	Season,
	SubProductionIdentifier,
	VenueBase
} from '.';
import { MODELS } from '../utils/constants';

export default class Production extends Entity {

	constructor (props = {}) {

		super(props);

		const {
			startDate,
			pressDate,
			endDate,
			material,
			venue,
			season,
			subProductions,
			producerCredits,
			cast,
			creativeCredits,
			crewCredits
		} = props;

		this.startDate = startDate?.trim() || '';

		this.pressDate = pressDate?.trim() || '';

		this.endDate = endDate?.trim() || '';

		this.material = new MaterialBase(material);

		this.venue = new VenueBase(venue);

		this.season = new Season(season);

		this.subProductions = subProductions
			? subProductions.map(subProduction => new SubProductionIdentifier(subProduction))
			: [];

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

		return MODELS.PRODUCTION;

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.validateDates();

		this.material.validateName({ isRequired: false });

		this.material.validateDifferentiator();

		this.venue.validateName({ isRequired: false });

		this.venue.validateDifferentiator();

		this.season.validateName({ isRequired: false });

		this.season.validateDifferentiator();

		const duplicateSubProductionIdentifierIndices = getDuplicateProductionIdentifierIndices(this.subProductions);

		this.subProductions.forEach((subProductionIdentifier, index) => {

			subProductionIdentifier.validateUuid();

			subProductionIdentifier.validateNoAssociationWithSelf({ uuid: this.uuid });

			subProductionIdentifier.validateUniquenessInGroup(
				{ isDuplicate: duplicateSubProductionIdentifierIndices.includes(index), properties: new Set(['uuid']) }
			);

		});

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

		const formatErrorText = 'Value must be in date format';

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

	async runDatabaseValidations () {

		for (const subProductionIdentifier of this.subProductions) {
			await subProductionIdentifier.runDatabaseValidations({ subjectProductionUuid: this.uuid });
		}

	}

}
