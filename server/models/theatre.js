import neo4jQuery from '../clients/neo4j';
import { getDeleteQuery } from '../database/cypher-queries/shared';
import { getValidateDeleteQuery } from '../database/cypher-queries/theatre';
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

		const { relationshipCount } = await neo4jQuery({ query: getValidateDeleteQuery(), params: this });

		if (relationshipCount > 0) this.errors.associations = ['productions'];

	}

	async delete () {

		await this.validateDeleteInDb();

		this.hasError = verifyErrorPresence(this);

		if (this.hasError) return { theatre: this };

		return neo4jQuery({ query: getDeleteQuery(this.model), params: this });

	}

}
