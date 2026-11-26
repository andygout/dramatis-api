export default () => `
	MATCH (locale:Locale { uuid: $uuid })

	CALL (locale) {
		OPTIONAL MATCH (surLocale:Locale)-[:CONTAINS*1..]->(locale)
			WHERE surLocale <> locale

		WITH surLocale
			ORDER BY surLocale.name

		RETURN
			COLLECT(
				CASE WHEN surLocale IS NULL
					THEN null
					ELSE surLocale { model: 'LOCALE', .uuid, .name }
				END
			) AS surLocales
	}

	CALL (locale) {
		OPTIONAL MATCH (locale)-[:CONTAINS*1..]->(subLocale:Locale)
			WHERE subLocale <> locale

		WITH subLocale
			ORDER BY subLocale.name

		RETURN
			COLLECT(
				CASE WHEN subLocale IS NULL
					THEN null
					ELSE subLocale { model: 'LOCALE', .uuid, .name }
				END
			) AS subLocales
	}

	RETURN
		'LOCALE' AS model,
		locale.uuid AS uuid,
		locale.name AS name,
		locale.differentiator AS differentiator,
		surLocales,
		subLocales
`;
