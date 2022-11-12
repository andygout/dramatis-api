import { ACTIONS } from '../../utils/constants';

const getCreateUpdateQuery = action => {

	const createUpdateQueryOpeningMap = {
		[ACTIONS.CREATE]: `
			CREATE (material:Material {
				uuid: $uuid,
				name: $name,
				differentiator: $differentiator,
				format: $format,
				year: $year
			})
		`,
		[ACTIONS.UPDATE]: `
			MATCH (material:Material { uuid: $uuid })

			OPTIONAL MATCH (material)-[originalVersionMaterialRel:SUBSEQUENT_VERSION_OF]->(:Material)

			DELETE originalVersionMaterialRel

			WITH DISTINCT material

			OPTIONAL MATCH (material)-[writerRel:HAS_WRITING_ENTITY]->(entity)
				WHERE entity:Person OR entity:Company

			DELETE writerRel

			WITH DISTINCT material

			OPTIONAL MATCH (material)-[sourceMaterialCreditRel:USES_SOURCE_MATERIAL]->(:Material)

			DELETE sourceMaterialCreditRel

			WITH DISTINCT material

			OPTIONAL MATCH (material)-[subMaterialRel:HAS_SUB_MATERIAL]->(:Material)

			DELETE subMaterialRel

			WITH DISTINCT material

			OPTIONAL MATCH (material)-[characterRel:DEPICTS]->(:Character)

			DELETE characterRel

			WITH DISTINCT material

			SET
				material.name = $name,
				material.differentiator = $differentiator,
				material.format = $format,
				material.year = $year
		`
	};

	return `
		${createUpdateQueryOpeningMap[action]}

		WITH material

		OPTIONAL MATCH (existingOriginalVersionMaterial:Material { name: $originalVersionMaterial.name })
			WHERE
				(
					$originalVersionMaterial.differentiator IS NULL AND
					existingOriginalVersionMaterial.differentiator IS NULL
				) OR
				$originalVersionMaterial.differentiator = existingOriginalVersionMaterial.differentiator

		FOREACH (item IN CASE $originalVersionMaterial.name WHEN NULL THEN [] ELSE [1] END |
			MERGE (originalVersionMaterial:Material {
				uuid: COALESCE(existingOriginalVersionMaterial.uuid, $originalVersionMaterial.uuid),
				name: $originalVersionMaterial.name
			})
				ON CREATE SET originalVersionMaterial.differentiator = $originalVersionMaterial.differentiator

			CREATE (material)-[:SUBSEQUENT_VERSION_OF]->(originalVersionMaterial)
		)

		WITH material

		UNWIND (CASE $writingCredits WHEN [] THEN [{ entities: [] }] ELSE $writingCredits END) AS writingCredit

			UNWIND
				CASE SIZE([entity IN writingCredit.entities WHERE entity.model = 'PERSON']) WHEN 0
					THEN [null]
					ELSE [entity IN writingCredit.entities WHERE entity.model = 'PERSON']
				END AS writingPersonParam

				OPTIONAL MATCH (existingWritingPerson:Person { name: writingPersonParam.name })
					WHERE
						(writingPersonParam.differentiator IS NULL AND existingWritingPerson.differentiator IS NULL) OR
						writingPersonParam.differentiator = existingWritingPerson.differentiator

				FOREACH (item IN CASE writingPersonParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (writingPerson:Person {
						uuid: COALESCE(existingWritingPerson.uuid, writingPersonParam.uuid),
						name: writingPersonParam.name
					})
						ON CREATE SET writingPerson.differentiator = writingPersonParam.differentiator

					CREATE (material)-
						[:HAS_WRITING_ENTITY {
							creditPosition: writingCredit.position,
							entityPosition: writingPersonParam.position,
							credit: writingCredit.name,
							creditType: writingCredit.creditType
						}]->(writingPerson)
				)

			WITH DISTINCT material, writingCredit

			UNWIND
				CASE SIZE([entity IN writingCredit.entities WHERE entity.model = 'COMPANY']) WHEN 0
					THEN [null]
					ELSE [entity IN writingCredit.entities WHERE entity.model = 'COMPANY']
				END AS writingCompanyParam

				OPTIONAL MATCH (existingWritingCompany:Company { name: writingCompanyParam.name })
					WHERE
						(
							writingCompanyParam.differentiator IS NULL AND
							existingWritingCompany.differentiator IS NULL
						) OR
						writingCompanyParam.differentiator = existingWritingCompany.differentiator

				FOREACH (item IN CASE writingCompanyParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (writingCompany:Company {
						uuid: COALESCE(existingWritingCompany.uuid, writingCompanyParam.uuid),
						name: writingCompanyParam.name
					})
						ON CREATE SET writingCompany.differentiator = writingCompanyParam.differentiator

					CREATE (material)-
						[:HAS_WRITING_ENTITY {
							creditPosition: writingCredit.position,
							entityPosition: writingCompanyParam.position,
							credit: writingCredit.name,
							creditType: writingCredit.creditType
						}]->(writingCompany)
				)

			WITH DISTINCT material, writingCredit

			UNWIND
				CASE SIZE([entity IN writingCredit.entities WHERE entity.model = 'MATERIAL']) WHEN 0
					THEN [null]
					ELSE [entity IN writingCredit.entities WHERE entity.model = 'MATERIAL']
				END AS sourceMaterialParam

				OPTIONAL MATCH (existingSourceMaterial:Material { name: sourceMaterialParam.name })
					WHERE
						(
							sourceMaterialParam.differentiator IS NULL AND
							existingSourceMaterial.differentiator IS NULL
						) OR
						sourceMaterialParam.differentiator = existingSourceMaterial.differentiator

				FOREACH (item IN CASE sourceMaterialParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (sourceMaterial:Material {
						uuid: COALESCE(existingSourceMaterial.uuid, sourceMaterialParam.uuid),
						name: sourceMaterialParam.name
					})
						ON CREATE SET sourceMaterial.differentiator = sourceMaterialParam.differentiator

					CREATE (material)-
						[:USES_SOURCE_MATERIAL {
							creditPosition: writingCredit.position,
							entityPosition: sourceMaterialParam.position,
							credit: writingCredit.name
						}]->(sourceMaterial)
				)

		WITH DISTINCT material

			UNWIND (CASE $subMaterials WHEN [] THEN [null] ELSE $subMaterials END) AS subMaterialParam

				OPTIONAL MATCH (existingSubMaterial:Material { name: subMaterialParam.name })
					WHERE
						(subMaterialParam.differentiator IS NULL AND existingSubMaterial.differentiator IS NULL) OR
						subMaterialParam.differentiator = existingSubMaterial.differentiator

				FOREACH (item IN CASE subMaterialParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (subMaterial:Material {
						uuid: COALESCE(existingSubMaterial.uuid, subMaterialParam.uuid),
						name: subMaterialParam.name
					})
						ON CREATE SET
							subMaterial.differentiator = subMaterialParam.differentiator,
							subMaterial.format = subMaterialParam.format,
							subMaterial.year = subMaterialParam.year

					CREATE (material)-[:HAS_SUB_MATERIAL { position: subMaterialParam.position }]->(subMaterial)
				)

		WITH DISTINCT material

		UNWIND (CASE $characterGroups WHEN [] THEN [{ characters: [] }] ELSE $characterGroups END) AS characterGroup

			UNWIND (CASE characterGroup.characters WHEN []
				THEN [null]
				ELSE characterGroup.characters
			END) AS characterParam

				OPTIONAL MATCH (existingCharacter:Character {
					name: COALESCE(characterParam.underlyingName, characterParam.name)
				})
					WHERE
						(characterParam.differentiator IS NULL AND existingCharacter.differentiator IS NULL) OR
						characterParam.differentiator = existingCharacter.differentiator

				FOREACH (item IN CASE characterParam WHEN NULL THEN [] ELSE [1] END |
					MERGE (character:Character {
						uuid: COALESCE(existingCharacter.uuid, characterParam.uuid),
						name: COALESCE(characterParam.underlyingName, characterParam.name)
					})
						ON CREATE SET character.differentiator = characterParam.differentiator

					CREATE (material)-
						[:DEPICTS {
							groupPosition: characterGroup.position,
							characterPosition: characterParam.position,
							displayName: CASE characterParam.underlyingName WHEN NULL
								THEN null
								ELSE characterParam.name
							END,
							qualifier: characterParam.qualifier,
							group: characterGroup.name
						}]->(character)
				)

		WITH DISTINCT material

		${getEditQuery()}
	`;

};

const getCreateQuery = () => getCreateUpdateQuery(ACTIONS.CREATE);

const getEditQuery = () => `
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

const getUpdateQuery = () => getCreateUpdateQuery(ACTIONS.UPDATE);

const getShowQuery = () => `
	MATCH (material:Material { uuid: $uuid })

	OPTIONAL MATCH (material)-[:SUBSEQUENT_VERSION_OF]-(originalOrSubsequentVersionMaterial)

	OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(sourcingMaterial:Material)

	OPTIONAL MATCH (material)-[:HAS_SUB_MATERIAL]-(subOrSurMaterial:Material)

	WITH
		material,
		[material] +
		COLLECT(originalOrSubsequentVersionMaterial) +
		COLLECT(sourcingMaterial) +
		COLLECT(subOrSurMaterial)
			AS relatedMaterials

	UNWIND (CASE relatedMaterials WHEN [] THEN [null] ELSE relatedMaterials END) AS relatedMaterial

		OPTIONAL MATCH (relatedMaterial)<-[originalVersionRel:SUBSEQUENT_VERSION_OF]-(material)

		OPTIONAL MATCH (relatedMaterial)-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]->(material)

		OPTIONAL MATCH (relatedMaterial)-[sourcingMaterialRel:USES_SOURCE_MATERIAL]->(material)

		OPTIONAL MATCH (relatedMaterial)-[surMaterialRel:HAS_SUB_MATERIAL]->(material)

		OPTIONAL MATCH (relatedMaterial)<-[subMaterialRel:HAS_SUB_MATERIAL]-(material)

		OPTIONAL MATCH (relatedMaterial)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
			WHERE entity:Person OR entity:Company OR entity:Material

		OPTIONAL MATCH (entity)<-[originalVersionWritingEntityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]-(material)

		OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
			WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

		OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

		WITH
			material,
			relatedMaterial,
			CASE originalVersionRel WHEN NULL THEN false ELSE true END AS isOriginalVersion,
			CASE subsequentVersionRel WHEN NULL THEN false ELSE true END AS isSubsequentVersion,
			CASE sourcingMaterialRel WHEN NULL THEN false ELSE true END AS isSourcingMaterial,
			CASE surMaterialRel WHEN NULL THEN false ELSE true END AS isSurMaterial,
			CASE subMaterialRel WHEN NULL THEN false ELSE true END AS isSubMaterial,
			subMaterialRel.position AS subMaterialPosition,
			entityRel,
			entity,
			entitySurMaterial,
			CASE originalVersionWritingEntityRel WHEN NULL THEN false ELSE true END AS isOriginalVersionWritingEntity,
			sourceMaterialWriterRel,
			sourceMaterialWriter
			ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

		WITH
			material,
			relatedMaterial,
			isOriginalVersion,
			isSubsequentVersion,
			isSourcingMaterial,
			isSurMaterial,
			isSubMaterial,
			subMaterialPosition,
			entityRel,
			entity,
			entitySurMaterial,
			isOriginalVersionWritingEntity,
			sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
			COLLECT(
				CASE sourceMaterialWriter WHEN NULL
					THEN null
					ELSE sourceMaterialWriter { model: TOUPPER(HEAD(LABELS(sourceMaterialWriter))), .uuid, .name }
				END
			) AS sourceMaterialWriters

		WITH
			material,
			relatedMaterial,
			isOriginalVersion,
			isSubsequentVersion,
			isSourcingMaterial,
			isSurMaterial,
			isSubMaterial,
			subMaterialPosition,
			entityRel,
			entity,
			entitySurMaterial,
			isOriginalVersionWritingEntity,
			COLLECT(
				CASE SIZE(sourceMaterialWriters) WHEN 0
					THEN null
					ELSE {
						model: 'WRITING_CREDIT',
						name: COALESCE(sourceMaterialWritingCreditName, 'by'),
						entities: sourceMaterialWriters
					}
				END
			) AS sourceMaterialWritingCredits
			ORDER BY entityRel.creditPosition, entityRel.entityPosition

		WITH
			material,
			relatedMaterial,
			isOriginalVersion,
			isSubsequentVersion,
			isSourcingMaterial,
			isSurMaterial,
			isSubMaterial,
			subMaterialPosition,
			entityRel.credit AS writingCreditName,
			[entity IN COLLECT(
				CASE WHEN entity IS NULL OR (isSubsequentVersion AND isOriginalVersionWritingEntity)
					THEN null
					ELSE entity {
						model: TOUPPER(HEAD(LABELS(entity))),
						.uuid,
						.name,
						.format,
						.year,
						surMaterial: CASE entitySurMaterial WHEN NULL
							THEN null
							ELSE entitySurMaterial { model: 'MATERIAL', .uuid, .name }
						END,
						writingCredits: sourceMaterialWritingCredits
					}
				END
			) | CASE entity.model WHEN 'MATERIAL'
				THEN entity
				ELSE entity { .model, .uuid, .name }
			END] AS entities

		WITH
			material,
			relatedMaterial,
			isOriginalVersion,
			isSubsequentVersion,
			isSourcingMaterial,
			isSurMaterial,
			isSubMaterial,
			subMaterialPosition,
			COLLECT(
				CASE SIZE(entities) WHEN 0
					THEN null
					ELSE {
						model: 'WRITING_CREDIT',
						name: COALESCE(writingCreditName, 'by'),
						entities: entities
					}
				END
			) AS writingCredits
			ORDER BY subMaterialPosition, relatedMaterial.year DESC, relatedMaterial.name

		OPTIONAL MATCH (relatedMaterial)<-[:HAS_SUB_MATERIAL]-(surMaterial:Material)

		WITH material,
			COLLECT(
				CASE relatedMaterial WHEN NULL
					THEN null
					ELSE relatedMaterial {
						model: 'MATERIAL',
						.uuid,
						.name,
						.format,
						.year,
						surMaterial: CASE surMaterial WHEN NULL
							THEN null
							ELSE surMaterial { model: 'MATERIAL', .uuid, .name }
						END,
						writingCredits,
						isOriginalVersion,
						isSubsequentVersion,
						isSourcingMaterial,
						isSurMaterial,
						isSubMaterial
					}
				END
			) AS relatedMaterials

	OPTIONAL MATCH (material)-[characterRel:DEPICTS]->(character:Character)

	WITH
		material,
		relatedMaterials,
		characterRel,
		character
		ORDER BY characterRel.groupPosition, characterRel.characterPosition

	WITH
		material,
		relatedMaterials,
		characterRel.group AS characterGroupName,
		characterRel.groupPosition AS characterGroupPosition,
		COLLECT(
			CASE character WHEN NULL
				THEN null
				ELSE character {
					model: 'CHARACTER',
					.uuid,
					name: COALESCE(characterRel.displayName, character.name),
					qualifier: characterRel.qualifier
				}
			END
		) AS characters

	WITH material, relatedMaterials,
		COLLECT(
			CASE SIZE(characters) WHEN 0
				THEN null
				ELSE {
					model: 'CHARACTER_GROUP',
					name: characterGroupName,
					position: characterGroupPosition,
					characters: characters
				}
			END
		) AS characterGroups

	OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL*0..1]-(:Material)<-[:PRODUCTION_OF]-(production:Production)

	WITH
		material,
		relatedMaterials,
		characterGroups,
		COLLECT(production) AS productions

	UNWIND (CASE productions WHEN [] THEN [null] ELSE productions END) AS production

		OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

		OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

		OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(:Material)<-[sourcingMaterialRel:PRODUCTION_OF]-(production)

		WITH
			material,
			relatedMaterials,
			characterGroups,
			production,
			venue,
			surVenue,
			CASE sourcingMaterialRel WHEN NULL THEN false ELSE true END AS usesSourcingMaterial
			ORDER BY production.startDate DESC, production.name, venue.name

		WITH
			material,
			relatedMaterials,
			characterGroups,
			COLLECT(
				CASE production WHEN NULL
					THEN null
					ELSE production {
						model: 'PRODUCTION',
						.uuid,
						.name,
						.startDate,
						.endDate,
						usesSourcingMaterial,
						venue: CASE venue WHEN NULL
							THEN null
							ELSE venue {
								model: 'VENUE',
								.uuid,
								.name,
								surVenue: CASE surVenue WHEN NULL
									THEN null
									ELSE surVenue { model: 'VENUE', .uuid, .name }
								END
							}
						END
					}
				END
			) AS productions

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions

	OPTIONAL MATCH (material)-[:HAS_SUB_MATERIAL*0..1]-(materialLinkedToCategory:Material)
		<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
		<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		CASE WHEN material <> materialLinkedToCategory
			THEN materialLinkedToCategory
			ELSE null
		END AS recipientMaterial

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(award:Award)

	OPTIONAL MATCH (category)-[nominatedEntityRel:HAS_NOMINEE]->(nominatedEntity)
		WHERE
			(
				(nominatedEntity:Person AND nominatedEntityRel.nominatedCompanyUuid IS NULL) OR
				nominatedEntity:Company
			) AND
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedEntityRel.nominationPosition
			)

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		recipientMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntityRel,
		COLLECT(nominatedEntity {
			model: TOUPPER(HEAD(LABELS(nominatedEntity))),
			.uuid,
			.name,
			nominatedMemberUuids: nominatedEntityRel.nominatedMemberUuids
		}) AS nominatedEntities

	UNWIND (CASE nominatedEntities WHEN [] THEN [null] ELSE nominatedEntities END) AS nominatedEntity

		UNWIND (COALESCE(nominatedEntity.nominatedMemberUuids, [null])) AS nominatedMemberUuid

			OPTIONAL MATCH (category)-[nominatedMemberRel:HAS_NOMINEE]->
				(nominatedMember:Person { uuid: nominatedMemberUuid })
				WHERE
					nominatedEntityRel.nominationPosition IS NULL OR
					nominatedEntityRel.nominationPosition = nominatedMemberRel.nominationPosition

			WITH
				material,
				relatedMaterials,
				characterGroups,
				productions,
				recipientMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				award,
				nominatedEntityRel,
				nominatedEntity,
				nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH
				material,
				relatedMaterials,
				characterGroups,
				productions,
				recipientMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				award,
				nominatedEntityRel,
				nominatedEntity,
				COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		recipientMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntityRel,
		nominatedEntity,
		nominatedMembers
		ORDER BY nominatedEntityRel.nominationPosition, nominatedEntityRel.entityPosition

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		recipientMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		[nominatedEntity IN COLLECT(
			CASE nominatedEntity WHEN NULL
				THEN null
				ELSE nominatedEntity { .model, .uuid, .name, members: nominatedMembers }
			END
		) | CASE nominatedEntity.model WHEN 'COMPANY'
			THEN nominatedEntity
			ELSE nominatedEntity { .model, .uuid, .name }
		END] AS nominatedEntities

	OPTIONAL MATCH (category)-[nominatedProductionRel:HAS_NOMINEE]->(nominatedProduction:Production)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedProductionRel.nominationPosition
			)

	OPTIONAL MATCH (nominatedProduction)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		recipientMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntities,
		nominatedProductionRel,
		nominatedProduction,
		venue,
		surVenue
		ORDER BY nominatedProductionRel.productionPosition

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		recipientMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntities,
		COLLECT(
			CASE nominatedProduction WHEN NULL
				THEN null
				ELSE nominatedProduction {
					model: 'PRODUCTION',
					.uuid,
					.name,
					.startDate,
					.endDate,
					venue: CASE venue WHEN NULL
						THEN null
						ELSE venue {
							model: 'VENUE',
							.uuid,
							.name,
							surVenue: CASE surVenue WHEN NULL
								THEN null
								ELSE surVenue { model: 'VENUE', .uuid, .name }
							END
						}
					END
				}
			END
		) AS nominatedProductions

	OPTIONAL MATCH (category)-[coNominatedMaterialRel:HAS_NOMINEE]->(coNominatedMaterial:Material)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = coNominatedMaterialRel.nominationPosition
			) AND
			coNominatedMaterial.uuid <> material.uuid AND
			NOT (material)-[:HAS_SUB_MATERIAL]-(coNominatedMaterial)

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		recipientMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntities,
		nominatedProductions,
		coNominatedMaterialRel,
		coNominatedMaterial
		ORDER BY coNominatedMaterialRel.materialPosition

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		recipientMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		award,
		nominatedEntities,
		nominatedProductions,
		COLLECT(
			CASE coNominatedMaterial WHEN NULL
				THEN null
				ELSE coNominatedMaterial { model: 'MATERIAL', .uuid, .name, .format, .year }
			END
		) AS coNominatedMaterials
		ORDER BY nomineeRel.nominationPosition

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		category,
		categoryRel,
		ceremony,
		award,
		COLLECT({
			model: 'NOMINATION',
			isWinner: COALESCE(nomineeRel.isWinner, false),
			type: COALESCE(nomineeRel.customType, CASE WHEN nomineeRel.isWinner THEN 'Winner' ELSE 'Nomination' END),
			recipientMaterial: CASE recipientMaterial WHEN NULL
				THEN null
				ELSE recipientMaterial { model: 'MATERIAL', .uuid, .name, .format, .year }
			END,
			entities: nominatedEntities,
			productions: nominatedProductions,
			coMaterials: coNominatedMaterials
		}) AS nominations
		ORDER BY categoryRel.position

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		ceremony,
		award,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		award,
		COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY award.name

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		COLLECT(award { model: 'AWARD', .uuid, .name, ceremonies }) AS awards

	OPTIONAL MATCH (material)-[:HAS_SUB_MATERIAL*0..1]-(:Material)
		<-[:SUBSEQUENT_VERSION_OF]-(:Material)-[:HAS_SUB_MATERIAL*0..1]-(nominatedSubsequentVersionMaterial:Material)
		<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
		<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)

	OPTIONAL MATCH (nominatedSubsequentVersionMaterial)
		<-[:HAS_SUB_MATERIAL]-(nominatedSubsequentVersionSurMaterial:Material)

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(subsequentVersionMaterialAward:Award)

	OPTIONAL MATCH (category)-[nominatedEntityRel:HAS_NOMINEE]->(nominatedEntity)
		WHERE
			(
				(nominatedEntity:Person AND nominatedEntityRel.nominatedCompanyUuid IS NULL) OR
				nominatedEntity:Company
			) AND
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedEntityRel.nominationPosition
			)

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntityRel,
		COLLECT(nominatedEntity {
			model: TOUPPER(HEAD(LABELS(nominatedEntity))),
			.uuid,
			.name,
			nominatedMemberUuids: nominatedEntityRel.nominatedMemberUuids
		}) AS nominatedEntities

	UNWIND (CASE nominatedEntities WHEN [] THEN [null] ELSE nominatedEntities END) AS nominatedEntity

		UNWIND (COALESCE(nominatedEntity.nominatedMemberUuids, [null])) AS nominatedMemberUuid

			OPTIONAL MATCH (category)-[nominatedMemberRel:HAS_NOMINEE]->
				(nominatedMember:Person { uuid: nominatedMemberUuid })
				WHERE
					nominatedEntityRel.nominationPosition IS NULL OR
					nominatedEntityRel.nominationPosition = nominatedMemberRel.nominationPosition

			WITH
				material,
				relatedMaterials,
				characterGroups,
				productions,
				awards,
				nominatedSubsequentVersionMaterial,
				nominatedSubsequentVersionSurMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				subsequentVersionMaterialAward,
				nominatedEntityRel,
				nominatedEntity,
				nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH
				material,
				relatedMaterials,
				characterGroups,
				productions,
				awards,
				nominatedSubsequentVersionMaterial,
				nominatedSubsequentVersionSurMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				subsequentVersionMaterialAward,
				nominatedEntityRel,
				nominatedEntity,
				COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntityRel,
		nominatedEntity,
		nominatedMembers
		ORDER BY nominatedEntityRel.nominationPosition, nominatedEntityRel.entityPosition

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		[nominatedEntity IN COLLECT(
			CASE nominatedEntity WHEN NULL
				THEN null
				ELSE nominatedEntity { .model, .uuid, .name, members: nominatedMembers }
			END
		) | CASE nominatedEntity.model WHEN 'COMPANY'
			THEN nominatedEntity
			ELSE nominatedEntity { .model, .uuid, .name }
		END] AS nominatedEntities

	OPTIONAL MATCH (category)-[nominatedProductionRel:HAS_NOMINEE]->(nominatedProduction:Production)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedProductionRel.nominationPosition
			)

	OPTIONAL MATCH (nominatedProduction)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntities,
		nominatedProductionRel,
		nominatedProduction,
		venue,
		surVenue
		ORDER BY nominatedProductionRel.productionPosition

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntities,
		COLLECT(
			CASE nominatedProduction WHEN NULL
				THEN null
				ELSE nominatedProduction {
					model: 'PRODUCTION',
					.uuid,
					.name,
					.startDate,
					.endDate,
					venue: CASE venue WHEN NULL
						THEN null
						ELSE venue {
							model: 'VENUE',
							.uuid,
							.name,
							surVenue: CASE surVenue WHEN NULL
								THEN null
								ELSE surVenue { model: 'VENUE', .uuid, .name }
							END
						}
					END
				}
			END
		) AS nominatedProductions

	OPTIONAL MATCH (category)-[nominatedMaterialRel:HAS_NOMINEE]->(nominatedMaterial:Material)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedMaterialRel.nominationPosition
			) AND
			nominatedMaterial.uuid <> nominatedSubsequentVersionMaterial.uuid AND NOT
			(material)<-[:SUBSEQUENT_VERSION_OF]-(nominatedMaterial)

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntities,
		nominatedProductions,
		nominatedMaterialRel,
		nominatedMaterial
		ORDER BY nominatedMaterialRel.materialPosition

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		nominatedSubsequentVersionMaterial,
		nominatedSubsequentVersionSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntities,
		nominatedProductions,
		COLLECT(
			CASE nominatedMaterial WHEN NULL
				THEN null
				ELSE nominatedMaterial { model: 'MATERIAL', .uuid, .name, .format, .year }
			END
		) AS nominatedMaterials
		ORDER BY nomineeRel.nominationPosition, nomineeRel.materialPosition

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		nomineeRel.isWinner AS isWinner,
		nomineeRel.customType AS customType,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		nominatedEntities,
		nominatedProductions,
		nominatedMaterials,
		COLLECT(
			CASE nominatedSubsequentVersionMaterial WHEN NULL
				THEN null
				ELSE nominatedSubsequentVersionMaterial {
					model: 'MATERIAL',
					.uuid,
					.name,
					.format,
					.year,
					surMaterial: CASE nominatedSubsequentVersionSurMaterial WHEN NULL
						THEN null
						ELSE nominatedSubsequentVersionSurMaterial { model: 'MATERIAL', .uuid, .name }
					END
				}
			END
		) AS nominatedSubsequentVersionMaterials

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		category,
		categoryRel,
		ceremony,
		subsequentVersionMaterialAward,
		COLLECT({
			model: 'NOMINATION',
			isWinner: COALESCE(isWinner, false),
			type: COALESCE(customType, CASE WHEN isWinner THEN 'Winner' ELSE 'Nomination' END),
			entities: nominatedEntities,
			productions: nominatedProductions,
			materials: nominatedMaterials,
			subsequentVersionMaterials: nominatedSubsequentVersionMaterials
		}) AS nominations
		ORDER BY categoryRel.position

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		ceremony,
		subsequentVersionMaterialAward,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		subsequentVersionMaterialAward,
		COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY subsequentVersionMaterialAward.name

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		COLLECT(subsequentVersionMaterialAward {
			model: 'AWARD',
			.uuid,
			.name,
			ceremonies
		}) AS subsequentVersionMaterialAwards

	OPTIONAL MATCH (material)-[:HAS_SUB_MATERIAL*0..1]-(:Material)
		<-[:USES_SOURCE_MATERIAL]-(:Material)-[:HAS_SUB_MATERIAL*0..1]-(nominatedSourcingMaterial:Material)
		<-[nomineeRel:HAS_NOMINEE]-(category:AwardCeremonyCategory)
		<-[categoryRel:PRESENTS_CATEGORY]-(ceremony:AwardCeremony)

	OPTIONAL MATCH (nominatedSourcingMaterial)<-[:HAS_SUB_MATERIAL]-(nominatedSourcingSurMaterial:Material)

	OPTIONAL MATCH (ceremony)<-[:PRESENTED_AT]-(sourcingMaterialAward:Award)

	OPTIONAL MATCH (category)-[nominatedEntityRel:HAS_NOMINEE]->(nominatedEntity)
		WHERE
			(
				(nominatedEntity:Person AND nominatedEntityRel.nominatedCompanyUuid IS NULL) OR
				nominatedEntity:Company
			) AND
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedEntityRel.nominationPosition
			)

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		nominatedEntityRel,
		COLLECT(nominatedEntity {
			model: TOUPPER(HEAD(LABELS(nominatedEntity))),
			.uuid,
			.name,
			nominatedMemberUuids: nominatedEntityRel.nominatedMemberUuids
		}) AS nominatedEntities

	UNWIND (CASE nominatedEntities WHEN [] THEN [null] ELSE nominatedEntities END) AS nominatedEntity

		UNWIND (COALESCE(nominatedEntity.nominatedMemberUuids, [null])) AS nominatedMemberUuid

			OPTIONAL MATCH (category)-[nominatedMemberRel:HAS_NOMINEE]->
				(nominatedMember:Person { uuid: nominatedMemberUuid })
				WHERE
					nominatedEntityRel.nominationPosition IS NULL OR
					nominatedEntityRel.nominationPosition = nominatedMemberRel.nominationPosition

			WITH
				material,
				relatedMaterials,
				characterGroups,
				productions,
				awards,
				subsequentVersionMaterialAwards,
				nominatedSourcingMaterial,
				nominatedSourcingSurMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				sourcingMaterialAward,
				nominatedEntityRel,
				nominatedEntity,
				nominatedMember
				ORDER BY nominatedMemberRel.memberPosition

			WITH
				material,
				relatedMaterials,
				characterGroups,
				productions,
				awards,
				subsequentVersionMaterialAwards,
				nominatedSourcingMaterial,
				nominatedSourcingSurMaterial,
				nomineeRel,
				category,
				categoryRel,
				ceremony,
				sourcingMaterialAward,
				nominatedEntityRel,
				nominatedEntity,
				COLLECT(nominatedMember { model: 'PERSON', .uuid, .name }) AS nominatedMembers

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		nominatedEntityRel,
		nominatedEntity,
		nominatedMembers
		ORDER BY nominatedEntityRel.nominationPosition, nominatedEntityRel.entityPosition

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		[nominatedEntity IN COLLECT(
			CASE nominatedEntity WHEN NULL
				THEN null
				ELSE nominatedEntity { .model, .uuid, .name, members: nominatedMembers }
			END
		) | CASE nominatedEntity.model WHEN 'COMPANY'
			THEN nominatedEntity
			ELSE nominatedEntity { .model, .uuid, .name }
		END] AS nominatedEntities

	OPTIONAL MATCH (category)-[nominatedProductionRel:HAS_NOMINEE]->(nominatedProduction:Production)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedProductionRel.nominationPosition
			)

	OPTIONAL MATCH (nominatedProduction)-[:PLAYS_AT]->(venue:Venue)

	OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		nominatedEntities,
		nominatedProductionRel,
		nominatedProduction,
		venue,
		surVenue
		ORDER BY nominatedProductionRel.productionPosition

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		nominatedEntities,
		COLLECT(
			CASE nominatedProduction WHEN NULL
				THEN null
				ELSE nominatedProduction {
					model: 'PRODUCTION',
					.uuid,
					.name,
					.startDate,
					.endDate,
					venue: CASE venue WHEN NULL
						THEN null
						ELSE venue {
							model: 'VENUE',
							.uuid,
							.name,
							surVenue: CASE surVenue WHEN NULL
								THEN null
								ELSE surVenue { model: 'VENUE', .uuid, .name }
							END
						}
					END
				}
			END
		) AS nominatedProductions

	OPTIONAL MATCH (category)-[nominatedMaterialRel:HAS_NOMINEE]->(nominatedMaterial:Material)
		WHERE
			(
				nomineeRel.nominationPosition IS NULL OR
				nomineeRel.nominationPosition = nominatedMaterialRel.nominationPosition
			) AND
			nominatedMaterial.uuid <> nominatedSourcingMaterial.uuid AND NOT
			(material)<-[:USES_SOURCE_MATERIAL]-(nominatedMaterial)

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		nominatedEntities,
		nominatedProductions,
		nominatedMaterialRel,
		nominatedMaterial
		ORDER BY nominatedMaterialRel.materialPosition

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		subsequentVersionMaterialAwards,
		nominatedSourcingMaterial,
		nominatedSourcingSurMaterial,
		nomineeRel,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		nominatedEntities,
		nominatedProductions,
		COLLECT(
			CASE nominatedMaterial WHEN NULL
				THEN null
				ELSE nominatedMaterial { model: 'MATERIAL', .uuid, .name, .format, .year }
			END
		) AS nominatedMaterials
		ORDER BY nomineeRel.nominationPosition, nomineeRel.materialPosition

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		subsequentVersionMaterialAwards,
		nomineeRel.isWinner AS isWinner,
		nomineeRel.customType AS customType,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		nominatedEntities,
		nominatedProductions,
		nominatedMaterials,
		COLLECT(
			CASE nominatedSourcingMaterial WHEN NULL
				THEN null
				ELSE nominatedSourcingMaterial {
					model: 'MATERIAL',
					.uuid,
					.name,
					.format,
					.year,
					surMaterial: CASE nominatedSourcingSurMaterial WHEN NULL
						THEN null
						ELSE nominatedSourcingSurMaterial { model: 'MATERIAL', .uuid, .name }
					END
				}
			END
		) AS nominatedSourcingMaterials

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		subsequentVersionMaterialAwards,
		category,
		categoryRel,
		ceremony,
		sourcingMaterialAward,
		COLLECT({
			model: 'NOMINATION',
			isWinner: COALESCE(isWinner, false),
			type: COALESCE(customType, CASE WHEN isWinner THEN 'Winner' ELSE 'Nomination' END),
			entities: nominatedEntities,
			productions: nominatedProductions,
			materials: nominatedMaterials,
			sourcingMaterials: nominatedSourcingMaterials
		}) AS nominations
		ORDER BY categoryRel.position

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		subsequentVersionMaterialAwards,
		ceremony,
		sourcingMaterialAward,
		COLLECT(category { model: 'AWARD_CEREMONY_CATEGORY', .name, nominations }) AS categories
		ORDER BY ceremony.name DESC

	WITH
		material,
		relatedMaterials,
		characterGroups,
		productions,
		awards,
		subsequentVersionMaterialAwards,
		sourcingMaterialAward,
		COLLECT(ceremony { model: 'AWARD_CEREMONY', .uuid, .name, categories }) AS ceremonies
		ORDER BY sourcingMaterialAward.name

	RETURN
		'MATERIAL' AS model,
		material.uuid AS uuid,
		material.name AS name,
		material.differentiator AS differentiator,
		material.format AS format,
		material.year AS year,
		HEAD([
			relatedMaterial IN relatedMaterials
				WHERE relatedMaterial.uuid = material.uuid | relatedMaterial.writingCredits
		]) AS writingCredits,
		HEAD([
			relatedMaterial IN relatedMaterials WHERE relatedMaterial.isOriginalVersion |
			relatedMaterial { .model, .uuid, .name, .format, .year, .surMaterial, .writingCredits }
		]) AS originalVersionMaterial,
		[
			relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSubsequentVersion |
			relatedMaterial { .model, .uuid, .name, .format, .year, .surMaterial, .writingCredits }
		] AS subsequentVersionMaterials,
		[
			relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSourcingMaterial |
			relatedMaterial { .model, .uuid, .name, .format, .year, .surMaterial, .writingCredits }
		] AS sourcingMaterials,
		HEAD([
			relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSurMaterial |
			relatedMaterial { .model, .uuid, .name, .format, .year, .writingCredits }
		]) AS surMaterial,
		[
			relatedMaterial IN relatedMaterials WHERE relatedMaterial.isSubMaterial |
			relatedMaterial { .model, .uuid, .name, .format, .year, .writingCredits }
		] AS subMaterials,
		characterGroups,
		[
			production IN productions WHERE NOT production.usesSourcingMaterial |
			production { .model, .uuid, .name, .startDate, .endDate, .venue }
		] AS productions,
		[
			production IN productions WHERE production.usesSourcingMaterial |
			production { .model, .uuid, .name, .startDate, .endDate, .venue }
		] AS sourcingMaterialProductions,
		awards,
		subsequentVersionMaterialAwards,
		COLLECT(sourcingMaterialAward { model: 'AWARD', .uuid, .name, ceremonies }) AS sourcingMaterialAwards
	`;

const getListQuery = () => `
	MATCH (material:Material)
		WHERE NOT (material)-[:HAS_SUB_MATERIAL]->(:Material)

	OPTIONAL MATCH (material)-[entityRel:HAS_WRITING_ENTITY|USES_SOURCE_MATERIAL]->(entity)
		WHERE entity:Person OR entity:Company OR entity:Material

	OPTIONAL MATCH (entity:Material)-[sourceMaterialWriterRel:HAS_WRITING_ENTITY]->(sourceMaterialWriter)
		WHERE sourceMaterialWriter:Person OR sourceMaterialWriter:Company

	OPTIONAL MATCH (entity:Material)<-[:HAS_SUB_MATERIAL]-(entitySurMaterial:Material)

	WITH material, entityRel, entity, entitySurMaterial, sourceMaterialWriterRel, sourceMaterialWriter
		ORDER BY sourceMaterialWriterRel.creditPosition, sourceMaterialWriterRel.entityPosition

	WITH
		material,
		entityRel,
		entity,
		entitySurMaterial,
		sourceMaterialWriterRel.credit AS sourceMaterialWritingCreditName,
		COLLECT(
			CASE sourceMaterialWriter WHEN NULL
				THEN null
				ELSE sourceMaterialWriter { model: TOUPPER(HEAD(LABELS(sourceMaterialWriter))), .uuid, .name }
			END
		) AS sourceMaterialWriters

	WITH material, entityRel, entity, entitySurMaterial,
		COLLECT(
			CASE SIZE(sourceMaterialWriters) WHEN 0
				THEN null
				ELSE {
					model: 'WRITING_CREDIT',
					name: COALESCE(sourceMaterialWritingCreditName, 'by'),
					entities: sourceMaterialWriters
				}
			END
		) AS sourceMaterialWritingCredits
		ORDER BY entityRel.creditPosition, entityRel.entityPosition

	WITH material, entityRel.credit AS writingCreditName,
		[entity IN COLLECT(
			CASE entity WHEN NULL
				THEN null
				ELSE entity {
					model: TOUPPER(HEAD(LABELS(entity))),
					.uuid,
					.name,
					.format,
					.year,
					surMaterial: CASE entitySurMaterial WHEN NULL
						THEN null
						ELSE entitySurMaterial { model: 'MATERIAL', .uuid, .name }
					END,
					writingCredits: sourceMaterialWritingCredits
				}
			END
		) | CASE entity.model WHEN 'MATERIAL'
			THEN entity
			ELSE entity { .model, .uuid, .name }
		END] AS entities

	WITH material,
		COLLECT(
			CASE SIZE(entities) WHEN 0
				THEN null
				ELSE {
					model: 'WRITING_CREDIT',
					name: COALESCE(writingCreditName, 'by'),
					entities: entities
				}
			END
		) AS writingCredits

	OPTIONAL MATCH (material)<-[surMaterialRel:HAS_SUB_MATERIAL]-(surMaterial:Material)

	RETURN
		'MATERIAL' AS model,
		material.uuid AS uuid,
		material.name AS name,
		material.format AS format,
		material.year AS year,
		CASE surMaterial WHEN NULL
			THEN null
			ELSE surMaterial { model: 'MATERIAL', .uuid, .name }
		END AS surMaterial,
		writingCredits
		ORDER BY material.year DESC, material.name

	LIMIT 100
`;

export {
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getShowQuery,
	getListQuery
};
