import Entity from './Entity';
import { MODELS } from '../utils/constants';

export default class Character extends Entity {

	constructor (props = {}) {

		super(props);

	}

	get model () {

		return MODELS.CHARACTER;

	}

}
