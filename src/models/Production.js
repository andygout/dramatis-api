import { getDuplicateBaseInstanceIndices, getDuplicateNameIndices } from '../lib/get-duplicate-indices';
import Base from './Base';
import { CastMember, CreativeCredit, CrewCredit, Material, ProducerCredit, Theatre } from '.';

export default class Production extends Base {

	constructor (props = {}) {

		super(props);

		const { uuid, theatre, material, producerCredits, cast, creativeCredits, crewCredits } = props;

		this.uuid = uuid;

		this.material = new Material({ ...material, isAssociation: true });

		this.theatre = new Theatre({ ...theatre, isAssociation: true });

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

		this.theatre.validateName({ isRequired: false });

		this.theatre.validateDifferentiator();

		this.material.validateName({ isRequired: false });

		this.material.validateDifferentiator();

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

	// Overrides Base model runDatabaseValidations() method because Production instances
	// do not require database validation as they can have the same name as others.
	runDatabaseValidations () {

		return;

	}

}
