import { pascalCasify } from '../../lib/strings';

const getExistenceQuery = model => `
	MATCH (n:${pascalCasify(model)} { uuid: $uuid })

	RETURN n
`;

const getDuplicateRecordCountQuery = model => `
	MATCH (n:${pascalCasify(model)} { name: $name })
		WHERE
			(
				($differentiator IS NULL AND n.differentiator IS NULL) OR
				$differentiator = n.differentiator
			) AND
			(
				$uuid IS NULL OR
				$uuid <> n.uuid
			)

	RETURN SIGN(COUNT(n)) AS instanceCount
`;

const getCreateQuery = model => `
	CREATE (n:${pascalCasify(model)} { uuid: $uuid, name: $name, differentiator: $differentiator })

	WITH n

	${getEditQuery(model)}
`;

const getEditQuery = model => `
	MATCH (n:${pascalCasify(model)} { uuid: $uuid })

	RETURN
		'${model}' AS model,
		n.uuid AS uuid,
		n.name AS name,
		n.differentiator AS differentiator
`;

const getUpdateQuery = model => `
	MATCH (n:${pascalCasify(model)} { uuid: $uuid })
		SET
			n.name = $name,
			n.differentiator = $differentiator

	WITH n

	${getEditQuery(model)}
`;

const getDeleteQuery = model => {

	const label = pascalCasify(model);

	return `
		MATCH (:${label} { uuid: $uuid })

		OPTIONAL MATCH (deletableInstance:${label} { uuid: $uuid })
			WHERE NOT (deletableInstance)-[]-()

		OPTIONAL MATCH (undeletableInstance:${label} { uuid: $uuid })
			-[]-(undeleteableInstanceAssociate)

		UNWIND
			CASE undeleteableInstanceAssociate WHEN NULL
				THEN [null]
				ELSE LABELS(undeleteableInstanceAssociate)
			END AS associateLabel

			WITH
				DISTINCT(associateLabel) AS distinctAssociateLabel,
				undeletableInstance,
				deletableInstance
				ORDER BY distinctAssociateLabel

			WITH
				undeletableInstance,
				deletableInstance,
				deletableInstance IS NOT NULL AS isDeleted,
				deletableInstance.name AS deletableInstanceName,
				deletableInstance.differentiator AS deletableInstancedifferentiator,
				COLLECT(distinctAssociateLabel) AS associatedModels

			DETACH DELETE deletableInstance

			RETURN
				CASE WHEN isDeleted
					THEN deletableInstanceName
					ELSE undeletableInstance.name
				END AS name,
				CASE WHEN isDeleted
					THEN deletableInstancedifferentiator
					ELSE undeletableInstance.differentiator
				END AS differentiator,
				isDeleted,
				associatedModels
	`;

};

const getListQuery = model => `
	MATCH (n:${pascalCasify(model)})

	RETURN
		'${model}' AS model,
		n.uuid AS uuid,
		n.name AS name

	ORDER BY n.name

	LIMIT 100
`;

export {
	getExistenceQuery,
	getDuplicateRecordCountQuery,
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getDeleteQuery,
	getListQuery
};
