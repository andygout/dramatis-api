import { neo4jQuery } from '../../../src/neo4j/query';

export default async opts => {

	const {
		sourceLabel,
		sourceUuid,
		destinationLabel,
		destinationUuid,
		relationshipName
	} = opts;

	const params = { sourceUuid, destinationUuid };

	const query = `
		MATCH (a:${sourceLabel} { uuid: $sourceUuid })-[relationship:${relationshipName}]->
			(b:${destinationLabel} { uuid: $destinationUuid })

		DELETE relationship
	`;

	await neo4jQuery(
		{ query, params },
		{ isOptionalResult: true }
	);

	return;

};
