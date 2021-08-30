import ProductionTeamCredit from './ProductionTeamCredit';
import { MODELS } from '../utils/constants';

export default class CrewCredit extends ProductionTeamCredit {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return MODELS.CREW_CREDIT;

	}

}
