import Base from './Base';
import { getDeleteQueries } from '../neo4j/cypher-queries';
import { neo4jQuery } from '../neo4j/query';

export default class Theatre extends Base {

	constructor (props = {}) {

		super(props);

		this.model = 'theatre';
		this.uuid = props.uuid;

	}

	async delete () {

		const { model, name, isDeleted } = await neo4jQuery({
			query: getDeleteQueries.theatre(),
			params: this
		});

		if (isDeleted) return { model, name };

		this.name = name;

		this.addPropertyError('associations', 'productions');

		this.setErrorStatus();

		return this;

	}

}
