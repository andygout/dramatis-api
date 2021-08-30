import ProductionTeamCredit from './ProductionTeamCredit';
import { MODELS } from '../utils/constants';

export default class CreativeCredit extends ProductionTeamCredit {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return MODELS.CREATIVE_CREDIT;

	}

}
