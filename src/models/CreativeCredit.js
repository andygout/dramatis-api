import ProductionTeamCredit from './ProductionTeamCredit';

export default class CreativeCredit extends ProductionTeamCredit {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return 'creativeCredit';

	}

}
