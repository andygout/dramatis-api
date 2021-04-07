import ProductionTeamCredit from './ProductionTeamCredit';

export default class CrewCredit extends ProductionTeamCredit {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return 'crewCredit';

	}

}
