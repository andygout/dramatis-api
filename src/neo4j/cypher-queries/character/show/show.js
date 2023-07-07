export default () => `
	MATCH (character:Character { uuid: $uuid })

	RETURN
		'CHARACTER' AS model,
		character.uuid AS uuid,
		character.name AS name,
		character.differentiator AS differentiator
`;
