export default () => `
	MATCH (material:Material { uuid: $uuid })

	OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial:Material)

	OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity:Person|Company|Material)

	WITH material, originalVersionMaterial, entityRel, entity
		ORDER BY entityRel.creditPosition, entityRel.entityPosition

	WITH
		material,
		originalVersionMaterial,
		entityRel.credit AS writingCreditName,
		entityRel.creditType AS writingCreditType,
		COLLECT(
			CASE WHEN entity IS NULL
				THEN null
				ELSE entity { model: TOUPPER(HEAD(LABELS(entity))), .name, .differentiator }
			END
		) + [{}] AS entities

	WITH material, originalVersionMaterial,
		COLLECT(
			CASE WHEN writingCreditName IS NULL AND SIZE(entities) = 1
				THEN null
				ELSE {
					name: writingCreditName,
					creditType: writingCreditType,
					entities: entities
				}
			END
		) + [{ entities: [{}] }] AS writingCredits

	OPTIONAL MATCH (material)-[subMaterialRel:HAS_SUB_MATERIAL]->(subMaterial:Material)

	WITH material, originalVersionMaterial, writingCredits, subMaterialRel, subMaterial
		ORDER BY subMaterialRel.position

	WITH material, originalVersionMaterial, writingCredits,
		COLLECT(
			CASE WHEN subMaterial IS NULL
				THEN null
				ELSE subMaterial { .name, .differentiator, .format, .year }
			END
		) + [{}] AS subMaterials

	OPTIONAL MATCH (material)-[settingRel:HAS_SETTING]->(setting:Setting)

	OPTIONAL MATCH (setting)-[:HAS_TIME]->(time:Time)

	OPTIONAL MATCH (setting)-[:HAS_PLACE]->(place:Place)

	OPTIONAL MATCH (setting)-[:HAS_LOCALE]->(locale:Locale)

	WITH
		material,
		originalVersionMaterial,
		writingCredits,
		subMaterials,
		setting,
		time,
		place,
		locale
		ORDER BY settingRel.position

	WITH
		material,
		originalVersionMaterial,
		writingCredits,
		subMaterials,
		setting,
		CASE WHEN time IS NULL
			THEN null
			ELSE time { .name, .differentiator }
		END AS time,
		CASE WHEN place IS NULL
			THEN null
			ELSE place { .name, .differentiator }
		END AS place,
		CASE WHEN locale IS NULL
			THEN null
			ELSE locale { .name, .differentiator }
		END AS locale

	WITH
		material,
		originalVersionMaterial,
		writingCredits,
		subMaterials,
		COLLECT(
			CASE WHEN setting IS NULL
				THEN null
				ELSE {
					time: COALESCE(time, {}),
					place: COALESCE(place, {}),
					locale: COALESCE(locale, {})
				}
			END
		) + [{}] AS settings

	OPTIONAL MATCH (material)-[characterRel:DEPICTS]->(character:Character)

	WITH material, originalVersionMaterial, writingCredits, subMaterials, settings, characterRel, character
		ORDER BY characterRel.groupPosition, characterRel.characterPosition

	WITH
		material,
		originalVersionMaterial,
		writingCredits,
		subMaterials,
		settings,
		characterRel.group AS characterGroupName,
		COLLECT(
			CASE WHEN character IS NULL
				THEN null
				ELSE character {
					name: COALESCE(characterRel.displayName, character.name),
					underlyingName: CASE WHEN characterRel.displayName IS NULL THEN null ELSE character.name END,
					.differentiator,
					qualifier: characterRel.qualifier,
					group: characterRel.group
				}
			END
		) + [{}] AS characters

	RETURN
		material.uuid AS uuid,
		material.name AS name,
		material.differentiator AS differentiator,
		material.subtitle AS subtitle,
		material.format AS format,
		material.year AS year,
		{
			name: COALESCE(originalVersionMaterial.name, ''),
			differentiator: COALESCE(originalVersionMaterial.differentiator, '')
		} AS originalVersionMaterial,
		writingCredits,
		subMaterials,
		settings,
		COLLECT(
			CASE WHEN characterGroupName IS NULL AND SIZE(characters) = 1
				THEN null
				ELSE { name: characterGroupName, characters: characters }
			END
		) + [{ characters: [{}] }] AS characterGroups
`;
