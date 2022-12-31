export default () => `
	MATCH (material:Material { uuid: $uuid })

	OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial:Material)

	OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
		WHERE entity:Person OR entity:Company OR entity:Material

	WITH material, originalVersionMaterial, entityRel, entity
		ORDER BY entityRel.creditPosition, entityRel.entityPosition

	WITH
		material,
		originalVersionMaterial,
		entityRel.credit AS writingCreditName,
		entityRel.creditType AS writingCreditType,
		COLLECT(
			CASE entity WHEN NULL
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
			CASE subMaterial WHEN NULL
				THEN null
				ELSE subMaterial { .name, .differentiator, .format, .year }
			END
		) + [{}] AS subMaterials

	OPTIONAL MATCH (material)-[characterRel:DEPICTS]->(character:Character)

	WITH material, originalVersionMaterial, writingCredits, subMaterials, characterRel, character
		ORDER BY characterRel.groupPosition, characterRel.characterPosition

	WITH material, originalVersionMaterial, writingCredits, subMaterials, characterRel.group AS characterGroupName,
		COLLECT(
			CASE character WHEN NULL
				THEN null
				ELSE character {
					name: COALESCE(characterRel.displayName, character.name),
					underlyingName: CASE characterRel.displayName WHEN NULL THEN null ELSE character.name END,
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
		material.format AS format,
		material.year AS year,
		{
			name: COALESCE(originalVersionMaterial.name, ''),
			differentiator: COALESCE(originalVersionMaterial.differentiator, '')
		} AS originalVersionMaterial,
		writingCredits,
		subMaterials,
		COLLECT(
			CASE WHEN characterGroupName IS NULL AND SIZE(characters) = 1
				THEN null
				ELSE { name: characterGroupName, characters: characters }
			END
		) + [{ characters: [{}] }] AS characterGroups
`;
