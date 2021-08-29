const getAwardContextualDuplicateRecordCountQuery = () => `
	MATCH (awardCeremony:AwardCeremony { name: $name })<-[:PRESENTED_AT]-(award:Award { name: $award.name })
		WHERE
			(
				$uuid IS NULL OR
				$uuid <> awardCeremony.uuid
			) AND
			(
				($award.differentiator IS NULL AND award.differentiator IS NULL) OR
				$award.differentiator = award.differentiator
			)

	RETURN SIGN(COUNT(awardCeremony)) AS duplicateRecordCount
`;

const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		create: `
			CREATE (awardCeremony:AwardCeremony { uuid: $uuid, name: $name })
		`,
		update: `
			MATCH (awardCeremony:AwardCeremony { uuid: $uuid })

			OPTIONAL MATCH (awardCeremony)-[relationship]-()

			DELETE relationship

			WITH DISTINCT awardCeremony

			SET awardCeremony.name = $name
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH awardCeremony

		OPTIONAL MATCH (existingAward:Award { name: $award.name })
			WHERE
				($award.differentiator IS NULL AND existingAward.differentiator IS NULL) OR
				$award.differentiator = existingAward.differentiator

		FOREACH (item IN CASE $award.name WHEN NULL THEN [] ELSE [1] END |
			MERGE (award:Award {
				uuid: COALESCE(existingAward.uuid, $award.uuid),
				name: $award.name
			})
				ON CREATE SET award.differentiator = $award.differentiator

			CREATE (awardCeremony)<-[:PRESENTED_AT]-(award)
		)

		WITH DISTINCT awardCeremony

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery('create');

const getEditQuery = () => `
	MATCH (awardCeremony:AwardCeremony { uuid: $uuid })

	OPTIONAL MATCH (awardCeremony)<-[:PRESENTED_AT]-(award:Award)

	RETURN
		'awardCeremony' AS model,
		awardCeremony.uuid AS uuid,
		awardCeremony.name AS name,
		{ name: COALESCE(award.name, ''), differentiator: COALESCE(award.differentiator, '') } AS award
`;

const getUpdateQuery = () => getCreateUpdateQuery('update');

const getShowQuery = () => `
	MATCH (awardCeremony:AwardCeremony { uuid: $uuid })

	OPTIONAL MATCH (awardCeremony)<-[:PRESENTED_AT]-(award:Award)

	RETURN
		'awardCeremony' AS model,
		awardCeremony.uuid AS uuid,
		awardCeremony.name AS name,
		CASE award WHEN NULL THEN null ELSE award { model: 'award', .uuid, .name } END AS award
`;

const getListQuery = () => `
	MATCH (awardCeremony:AwardCeremony)

	OPTIONAL MATCH (awardCeremony)<-[:PRESENTED_AT]-(award:Award)

	RETURN
		'awardCeremony' AS model,
		awardCeremony.uuid AS uuid,
		awardCeremony.name AS name,
		CASE award WHEN NULL THEN null ELSE award { model: 'award', .uuid, .name } END AS award

	ORDER BY awardCeremony.name DESC, award.name

	LIMIT 100
`;

export {
	getAwardContextualDuplicateRecordCountQuery,
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQuery,
	getListQuery
};
