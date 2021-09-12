import Base from './Base';
import { MODELS } from '../utils/constants';

export default class AwardCategoryCeremony extends Base {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return MODELS.AWARD_CEREMONY_CATEGORY;

	}

}
