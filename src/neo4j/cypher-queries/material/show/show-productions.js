export default () => `
	MATCH (material:Material { uuid: $uuid })

	CALL {
		WITH material

		OPTIONAL MATCH (material)<-[:SUBSEQUENT_VERSION_OF]-(subsequentVersionMaterial)
			WHERE NOT EXISTS(
				(material)<-[:SUBSEQUENT_VERSION_OF]-(:Material)<-[:HAS_SUB_MATERIAL*1..2]-(subsequentVersionMaterial)
			)

		WITH
			material,
			COLLECT(subsequentVersionMaterial) AS subsequentVersionMaterials

		OPTIONAL MATCH (material)<-[:USES_SOURCE_MATERIAL]-(sourcingMaterial:Material)
			WHERE NOT EXISTS(
				(material)<-[:USES_SOURCE_MATERIAL]-(:Material)<-[:HAS_SUB_MATERIAL*1..2]-(sourcingMaterial)
			)

		WITH
			material,
			subsequentVersionMaterials,
			COLLECT(sourcingMaterial) AS sourcingMaterials

		WITH
			material,
			[material] + subsequentVersionMaterials + sourcingMaterials AS relatedMaterials

		UNWIND (CASE relatedMaterials WHEN [] THEN [null] ELSE relatedMaterials END) AS relatedMaterial

			OPTIONAL MATCH (relatedMaterial)-[subsequentVersionRel:SUBSEQUENT_VERSION_OF]->(material)

			OPTIONAL MATCH (relatedMaterial)-[sourcingMaterialRel:USES_SOURCE_MATERIAL]->(material)

			OPTIONAL MATCH (relatedMaterial)<-[:PRODUCTION_OF]-(production:Production)

			OPTIONAL MATCH (production)-[:PLAYS_AT]->(venue:Venue)

			OPTIONAL MATCH (venue)<-[:HAS_SUB_VENUE]-(surVenue:Venue)

			OPTIONAL MATCH (production)<-[surProductionRel:HAS_SUB_PRODUCTION]-(surProduction:Production)

			OPTIONAL MATCH (surProduction)<-[surSurProductionRel:HAS_SUB_PRODUCTION]-(surSurProduction:Production)

			WITH
				production,
				venue,
				surVenue,
				surProduction,
				surProductionRel,
				surSurProduction,
				surSurProductionRel,
				CASE WHEN subsequentVersionRel IS NULL THEN false ELSE true END AS usesSubsequentVersion,
				CASE WHEN sourcingMaterialRel IS NULL THEN false ELSE true END AS usesSourcingMaterial
				ORDER BY
					production.startDate DESC,
					COALESCE(surSurProduction.name, surProduction.name, production.name),
					COALESCE(surSurProductionRel.position, surProductionRel.position, -1) DESC,
					COALESCE(surSurProductionRel.position, -1) DESC,
					COALESCE(surProductionRel.position, -1) DESC,
					venue.name

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
							usesSubsequentVersion,
							usesSourcingMaterial,
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
							END
						}
					END
				) AS productions

		RETURN
			[
				production IN productions WHERE
					NOT production.usesSubsequentVersion AND
					NOT production.usesSourcingMaterial |
				production { .model, .uuid, .name, .startDate, .endDate, .venue, .surProduction }
			] AS productions,
			[
				production IN productions WHERE production.usesSubsequentVersion |
				production { .model, .uuid, .name, .startDate, .endDate, .venue, .surProduction }
			] AS subsequentVersionMaterialProductions,
			[
				production IN productions WHERE production.usesSourcingMaterial |
				production { .model, .uuid, .name, .startDate, .endDate, .venue, .surProduction }
			] AS sourcingMaterialProductions
	}

	RETURN
		productions,
		subsequentVersionMaterialProductions,
		sourcingMaterialProductions
`;
