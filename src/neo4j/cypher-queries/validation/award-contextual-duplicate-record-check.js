export default () => `
	MATCH (ceremony:AwardCeremony { name: $name })<-[:PRESENTED_AT]-(award:Award { name: $award.name })
		WHERE
			(
				$uuid IS NULL OR
				$uuid <> ceremony.uuid
			) AND
			(
				($award.differentiator IS NULL AND award.differentiator IS NULL) OR
				$award.differentiator = award.differentiator
			)

	RETURN
		TOBOOLEAN(COUNT(ceremony)) AS isDuplicateRecord
`;
