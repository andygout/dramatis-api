import Base from './Base';
import { Nomination } from '.';
import { MODELS } from '../utils/constants';

export default class AwardCeremonyCategory extends Base {

	constructor (props = {}) {

		super(props);

		const { nominations } = props;

		this.nominations = nominations
			? nominations.map(nomination => new Nomination(nomination))
			: [];

	}

	get model () {

		return MODELS.AWARD_CEREMONY_CATEGORY;

	}

	runInputValidations (opts) {

		this.validateName({ isRequired: false });

		this.validateUniquenessInGroup({ isDuplicate: opts.isDuplicate });

		this.validateNamePresenceIfNamedChildren(this.nominations.map(nomination => nomination.entities).flat());

		this.nominations.forEach(nomination => nomination.runInputValidations());

	}

	async runDatabaseValidations () {

		for (const nomination of this.nominations) await nomination.runDatabaseValidations();

	}

}
