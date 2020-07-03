import Base from './Base';
import { getValidateDeleteRequestQueries, sharedQueries } from '../neo4j/cypher-queries';
import { neo4jQuery } from '../neo4j/query';

export default class Theatre extends Base {

	constructor (props = {}) {

		super(props);

		this.model = 'theatre';
		this.uuid = props.uuid;

	}

	async validateDeleteRequestInDatabase () {

		const { relationshipCount } = await neo4jQuery({
			query: getValidateDeleteRequestQueries[this.model](),
			params: this
		});

		if (relationshipCount > 0) this.addPropertyError('associations', 'productions');

	}

	async delete () {

		await this.validateDeleteRequestInDatabase();

		this.setErrorStatus();

		if (this.hasErrors) return { theatre: this };

		return neo4jQuery({ query: sharedQueries.getDeleteQuery(this.model), params: this });

	}

}
