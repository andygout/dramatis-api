import { prepareAsParams } from '../lib/prepare-as-params';
import MaterialBase from './MaterialBase';
import { validationQueries } from '../neo4j/cypher-queries';
import { neo4jQuery } from '../neo4j/query';

export default class OriginalVersionMaterial extends MaterialBase {

	constructor (props = {}) {

		super(props);

	}

	async runDatabaseValidations ({ subjectMaterialUuid = null }) {

		if (this.name) {

			const { getOriginalVersionMaterialChecksQuery } = validationQueries;

			const preparedParams = prepareAsParams(this);

			const {
				isSubsequentVersionMaterialOfSubjectMaterial
			} = await neo4jQuery({
				query: getOriginalVersionMaterialChecksQuery(),
				params: {
					name: preparedParams.name,
					differentiator: preparedParams.differentiator,
					subjectMaterialUuid
				}
			});

			if (isSubsequentVersionMaterialOfSubjectMaterial) {
				this.addPropertyError(
					'name',
					'Material with these attributes is this material\'s subsequent version material'
				);
				this.addPropertyError(
					'differentiator',
					'Material with these attributes is this material\'s subsequent version material'
				);
			}

		}

		return;

	}

}
