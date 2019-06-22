import { getDeleteQuery } from '../database/cypher-queries/shared';
import { getValidateDeleteQuery } from '../database/cypher-queries/theatre';
import dbQuery from '../database/db-query';
import verifyErrorPresence from '../lib/verify-error-presence';
import Base from './base';

export default class Theatre extends Base {

	constructor (props = {}) {

		super(props);

		Object.defineProperty(this, 'model', {
			get: function () { return 'theatre'; }
		});

		this.productions = [];

	}

	async validateDeleteInDb () {

		const { relationshipCount } = await dbQuery({ query: getValidateDeleteQuery(), params: this });

		if (relationshipCount > 0) this.errors.associations = ['productions'];

	}

	async delete () {

		await this.validateDeleteInDb();

		this.hasError = verifyErrorPresence(this);

		if (this.hasError) return { theatre: this };

		return dbQuery({ query: getDeleteQuery(this.model), params: this });

	}

}
