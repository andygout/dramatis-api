export default () => `
	CALL db.index.fulltext.queryNodes('names', $searchTerm)

	YIELD node, score

	RETURN
		CASE HEAD(LABELS(node))
			WHEN 'AwardCeremony' THEN 'AWARD_CEREMONY'
			WHEN 'FestivalSeries' THEN 'FESTIVAL_SERIES'
			ELSE TOUPPER(HEAD(LABELS(node)))
		END AS model,
		node.uuid AS uuid,
		node.name AS name

	LIMIT 10
`;
