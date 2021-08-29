import { prepareAsParams } from '../lib/prepare-as-params';
import Entity from './Entity';
import { Award } from '.';
import { getAwardContextualDuplicateRecordCountQuery } from '../neo4j/cypher-queries';
import { neo4jQuery } from '../neo4j/query';

export default class AwardCeremony extends Entity {

	constructor (props = {}) {

		super(props);

		const { award } = props;

		this.award = new Award(award);

	}

	get model () {

		return 'awardCeremony';

	}

	runInputValidations () {

		this.validateName({ isRequired: true });

		this.award.validateName({ isRequired: false });

		this.award.validateDifferentiator();

	}

	async runDatabaseValidations () {

		await this.validateAwardContextualUniquenessInDatabase();

	}

	async validateAwardContextualUniquenessInDatabase () {

		const preparedParams = prepareAsParams(this);

		const { duplicateRecordCount } = await neo4jQuery({
			query: getAwardContextualDuplicateRecordCountQuery(),
			params: {
				uuid: preparedParams.uuid,
				name: preparedParams.name,
				award: {
					name: preparedParams.award.name,
					differentiator: preparedParams.award.differentiator
				}
			}
		});

		if (duplicateRecordCount > 0) {

			const uniquenessErrorMessage = 'Award ceremony already exists for given award';

			this.addPropertyError('name', uniquenessErrorMessage);

			this.award.addPropertyError('name', uniquenessErrorMessage);

			this.award.addPropertyError('differentiator', uniquenessErrorMessage);

		}

	}

}
