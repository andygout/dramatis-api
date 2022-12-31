export default () => `
	MATCH (ceremony:AwardCeremony)

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	RETURN
		'AWARD_CEREMONY' AS model,
		ceremony.uuid AS uuid,
		ceremony.name AS name,
		CASE award WHEN NULL THEN null ELSE award { model: 'AWARD', .uuid, .name } END AS award

	ORDER BY ceremony.name DESC, award.name

	LIMIT 100
`;
