import { getDeleteQuery } from '../database/cypher-queries/shared';
import dbQuery from '../database/db-query';
import Base from './base';
import Role from './role';

export default class Person extends Base {

	constructor (props = {}) {

		super(props);

		Object.defineProperty(this, 'model', {
			get: function () { return 'person'; }
		});

		this.productions = [];
		this.roles = props.roles ?
			props.roles.filter(role => role.name.length).map(role => new Role(role)) :
			[];

	};

	delete () {

		return dbQuery({ query: getDeleteQuery(this.model), params: this });

	};

};
