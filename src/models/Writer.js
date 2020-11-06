import Person from './Person';

export default class Writer extends Person {

	constructor (props = {}) {

		super(props);

		const { group } = props;

		this.group = group?.trim() || '';

	}

	validateGroup () {

		this.validateStringForProperty('group', { isRequired: false });

	}

}
