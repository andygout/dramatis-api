import PlaceBase from './PlaceBase.js';
import prepareAsParams from '../lib/prepare-as-params.js';
import { validationQueries } from '../neo4j/cypher-queries/index.js';
import { neo4jQuery } from '../neo4j/query.js';

export default class SurPlace extends PlaceBase {
	constructor(props = {}) {
		super(props);
	}

	async runDatabaseValidations({ subjectPlaceUuid = null }) {
		if (this.name) {
			const { getSurPlaceChecksQuery } = validationQueries;

			const preparedParams = prepareAsParams(this);

			const { isSubPlaceOfSubjectPlace } = await neo4jQuery({
				query: getSurPlaceChecksQuery(),
				params: {
					name: preparedParams.name,
					differentiator: preparedParams.differentiator,
					subjectPlaceUuid
				}
			});

			if (isSubPlaceOfSubjectPlace) {
				this.addPropertyError(
					'name',
					"Place with these attributes is this place's sub-place"
				);
				this.addPropertyError(
					'differentiator',
					"Place with these attributes is this place's sub-place"
				);
			}
		}

		return;
	}
}
