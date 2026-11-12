export default () => `
	MATCH (p:Place { name: $name })
		WHERE
			(
				($differentiator IS NULL AND p.differentiator IS NULL) OR
				$differentiator = p.differentiator
			)

	OPTIONAL MATCH (subjectPlace:Place { uuid: $subjectPlaceUuid })

	OPTIONAL MATCH (subjectPlace)-[surPlaceRelWithSubjectPlace:CONTAINS]->(p)

	RETURN
		TOBOOLEAN(COUNT(surPlaceRelWithSubjectPlace)) AS isSubPlaceOfSubjectPlace
`;
