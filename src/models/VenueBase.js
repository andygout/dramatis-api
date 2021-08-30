import Entity from './Entity';
import { MODELS } from '../utils/constants';

export default class Venue extends Entity {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return MODELS.VENUE;

	}

}
