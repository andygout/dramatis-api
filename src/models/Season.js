import Entity from './Entity';
import { MODELS } from '../utils/constants';

export default class Season extends Entity {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return MODELS.SEASON;

	}

}
