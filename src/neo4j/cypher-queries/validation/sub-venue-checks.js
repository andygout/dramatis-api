export default () => `
	MATCH (v:Venue { name: $name })
		WHERE
			(
				($differentiator IS NULL AND v.differentiator IS NULL) OR
				$differentiator = v.differentiator
			)

	OPTIONAL MATCH (subjectVenue:Venue { uuid: $subjectVenueUuid })

	OPTIONAL MATCH (v)<-[surVenueRel:HAS_SUB_VENUE]-(surVenue:Venue)
		WHERE
			$subjectVenueUuid IS NULL OR
			$subjectVenueUuid <> surVenue.uuid

	OPTIONAL MATCH (v)-[subVenueRel:HAS_SUB_VENUE]->(:Venue)

	OPTIONAL MATCH (subjectVenue)<-[subjectVenueSurVenueRel:HAS_SUB_VENUE]-(:Venue)

	RETURN
		TOBOOLEAN(COUNT(surVenueRel)) AS isAssignedToSurVenue,
		TOBOOLEAN(COUNT(subVenueRel)) AS isSurVenue,
		TOBOOLEAN(COUNT(subjectVenueSurVenueRel)) AS isSubjectVenueASubVenue
`;
