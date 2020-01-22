import Base from './base';
import { getDeleteQuery } from '../neo4j/cypher-queries/shared';
import { getValidateDeleteQuery } from '../neo4j/cypher-queries/theatre';
import { neo4jQuery } from '../neo4j/query';

export default class Theatre extends Base {

	constructor (props = {}) {

		super(props);

		this.model = 'theatre';
		this.uuid = props.uuid;

	}

	async validateDeleteInDb () {

		const { relationshipCount } = await neo4jQuery({ query: getValidateDeleteQuery(), params: this });

		if (relationshipCount > 0) this.errors.associations = ['productions'];

	}

	async delete () {

		await this.validateDeleteInDb();

		this.setErrorStatus();

		if (this.hasErrors) return { theatre: this };

		return neo4jQuery({ query: getDeleteQuery(this.model), params: this });

	}

}
