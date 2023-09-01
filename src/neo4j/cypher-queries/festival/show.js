export default () => [`
	MATCH (festival:Festival { uuid: $uuid })
	RETURN
		'FESTIVAL' AS model,
		festival.uuid AS uuid,
		festival.name AS name,
		festival.differentiator AS differentiator
`];
