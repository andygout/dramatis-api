const getShowQuery = () => `
	MATCH (award:Award { uuid: $uuid })

	OPTIONAL MATCH (award)-[:PRESENTED_AT]->(awardCeremony:AwardCeremony)

	WITH award, awardCeremony
		ORDER BY awardCeremony.name DESC

	RETURN
		'award' AS model,
		award.uuid AS uuid,
		award.name AS name,
		award.differentiator AS differentiator,
		COLLECT(
			CASE awardCeremony WHEN NULL
				THEN null
				ELSE awardCeremony { model: 'awardCeremony', .uuid, .name }
			END
		) AS awardCeremonies
`;

export {
	getShowQuery
};
