export default () => `
	MATCH (person:Person { uuid: $uuid })

	CALL {
		WITH person

		OPTIONAL MATCH (person)<-[:HAS_WRITING_ENTITY]-(:Material)<-[:USES_SOURCE_MATERIAL*0..1]-(material:Material)
			WHERE NOT EXISTS(
				(person)<-[:HAS_WRITING_ENTITY]-(:Material)<-[:USES_SOURCE_MATERIAL*0..1]-(:Material)
				<-[:HAS_SUB_MATERIAL*1..2]-(material)
			)

		WITH person, COLLECT(DISTINCT(material)) AS materials

		UNWIND (CASE materials WHEN [] THEN [null] ELSE materials END) AS material

			OPTIONAL MATCH (person)<-[writerRel:HAS_WRITING_ENTITY]-(material)

			OPTIONAL MATCH (person)<-[:HAS_WRITING_ENTITY]-(:Material)
				<-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]-(material)

			OPTIONAL MATCH (person)<-[:HAS_WRITING_ENTITY]-(:Material)
				<-[sourcingMaterialRel:USES_SOURCE_MATERIAL]-(material)

			OPTIONAL MATCH (material)<-[:PRODUCTION_OF]-(production:Production)
				WHERE NOT EXISTS((material)<-[:PRODUCTION_OF]-(:Production)<-[:HAS_SUB_PRODUCTION*1..2]-(production))

			OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

			OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

			OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)

			OPTIONAL MATCH (surProduction)<-[surSurProductionRel:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

			WITH
				material,
				writerRel.creditType AS creditType,
				CASE WHEN writerRel IS NULL THEN false ELSE true END AS hasDirectCredit,
				CASE WHEN subsequentVersionRel IS NULL THEN false ELSE true END AS isSubsequentVersion,
				CASE WHEN sourcingMaterialRel IS NULL THEN false ELSE true END AS isSourcingMaterial,
				production,
				venue,
				surVenue,
				surProduction,
				surProductionRel,
				surSurProduction,
				surSurProductionRel
				ORDER BY
					production.startDate DESC,
					COALESCE(surSurProduction.name, surProduction.name, production.name),
					surSurProductionRel.position DESC,
					surProductionRel.position DESC

			WITH
				COLLECT(
					CASE WHEN production IS NULL
						THEN null
						ELSE production {
							model: 'PRODUCTION',
							.uuid,
							.name,
							.startDate,
							.endDate,
							venue: CASE WHEN venue IS NULL
								THEN null
								ELSE venue {
									model: 'VENUE',
									.uuid,
									.name,
									surVenue: CASE WHEN surVenue IS NULL
										THEN null
										ELSE surVenue { model: 'VENUE', .uuid, .name }
									END
								}
							END,
							surProduction: CASE WHEN surProduction IS NULL
								THEN null
								ELSE surProduction {
									model: 'PRODUCTION',
									.uuid,
									.name,
									surProduction: CASE WHEN surSurProduction IS NULL
										THEN null
										ELSE surSurProduction { model: 'PRODUCTION', .uuid, .name }
									END
								}
							END,
							creditType,
							hasDirectCredit,
							isSubsequentVersion,
							isSourcingMaterial
						}
					END
				) AS productions

		RETURN
			[
				production IN productions WHERE
					production.hasDirectCredit AND
					NOT production.isSubsequentVersion AND
					production.creditType IS NULL |
				production { .model, .uuid, .name, .startDate, .endDate, .venue, .surProduction }
			] AS materialProductions,
			[
				production IN productions WHERE production.isSubsequentVersion |
				production { .model, .uuid, .name, .startDate, .endDate, .venue, .surProduction }
			] AS subsequentVersionMaterialProductions,
			[
				production IN productions WHERE
					production.isSourcingMaterial OR
					production.creditType = 'NON_SPECIFIC_SOURCE_MATERIAL' |
				production { .model, .uuid, .name, .startDate, .endDate, .venue, .surProduction }
			] AS sourcingMaterialProductions,
			[
				production IN productions WHERE production.creditType = 'RIGHTS_GRANTOR' |
				production { .model, .uuid, .name, .startDate, .endDate, .venue, .surProduction }
			] AS rightsGrantorMaterialProductions
	}

	RETURN
		materialProductions,
		subsequentVersionMaterialProductions,
		sourcingMaterialProductions,
		rightsGrantorMaterialProductions
`;
