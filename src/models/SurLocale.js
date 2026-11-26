import LocaleBase from './LocaleBase.js';
import prepareAsParams from '../lib/prepare-as-params.js';
import { validationQueries } from '../neo4j/cypher-queries/index.js';
import { neo4jQuery } from '../neo4j/query.js';

export default class SurLocale extends LocaleBase {
	constructor(props = {}) {
		super(props);
	}

	async runDatabaseValidations({ subjectLocaleUuid = null }) {
		if (this.name) {
			const { getSurLocaleChecksQuery } = validationQueries;

			const preparedParams = prepareAsParams(this);

			const { isSubLocaleOfSubjectLocale } = await neo4jQuery({
				query: getSurLocaleChecksQuery(),
				params: {
					name: preparedParams.name,
					differentiator: preparedParams.differentiator,
					subjectLocaleUuid
				}
			});

			if (isSubLocaleOfSubjectLocale) {
				this.addPropertyError('name', 'Locale with these attributes is a descendent of this locale');
				this.addPropertyError('differentiator', 'Locale with these attributes is a descendent of this locale');
			}
		}

		return;
	}
}
