export default () => `
	MATCH (place:Place { name: $name })
		WHERE
			(
				($differentiator IS NULL AND place.differentiator IS NULL) OR
				$differentiator = place.differentiator
			)

	OPTIONAL MATCH (subjectPlace:Place { uuid: $subjectPlaceUuid })

	OPTIONAL MATCH (subjectPlace)-[surPlaceRelWithSubjectPlace:CONTAINS*1..]->(place)

	RETURN
		TOBOOLEAN(COUNT(surPlaceRelWithSubjectPlace)) AS isSubPlaceOfSubjectPlace
`;
