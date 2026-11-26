export default () => `
	MATCH (locale:Locale { name: $name })
		WHERE
			(
				($differentiator IS NULL AND locale.differentiator IS NULL) OR
				$differentiator = locale.differentiator
			)

	OPTIONAL MATCH (subjectLocale:Locale { uuid: $subjectLocaleUuid })

	OPTIONAL MATCH (subjectLocale)-[surLocaleRelWithSubjectLocale:CONTAINS*1..]->(locale)

	RETURN
		TOBOOLEAN(COUNT(surLocaleRelWithSubjectLocale)) AS isSubLocaleOfSubjectLocale
`;
