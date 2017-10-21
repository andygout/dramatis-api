const getValidateDeleteQuery = () => `
	MATCH (theatre:Theatre { uuid: $uuid })<-[relationship:PLAYS_AT]-(production:Production)

	RETURN SIGN(COUNT(relationship)) AS relationshipCount
`;

const getShowQuery = () => `
	MATCH (theatre:Theatre { uuid: $uuid })

	OPTIONAL MATCH (theatre)<-[:PLAYS_AT]-(production:Production)

	WITH theatre, production
		ORDER BY production.name, theatre.name

	RETURN {
		model: 'theatre',
		uuid: theatre.uuid,
		name: theatre.name,
		productions: COLLECT(CASE WHEN production IS NULL THEN null ELSE
				{ model: 'production', uuid: production.uuid, name: production.name }
			END)
	} AS instance
`;

export {
	getValidateDeleteQuery,
	getShowQuery
};
