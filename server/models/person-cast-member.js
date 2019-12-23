import Base from './base';
import Role from './role';

export default class PersonCastMember extends Base {

	constructor (props = {}) {

		super(props);

		this.model = 'person';
		this.roles = props.roles
			? props.roles.map(role => new Role(role))
			: [];

	}

}
