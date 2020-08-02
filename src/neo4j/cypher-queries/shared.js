import { capitalise } from '../../lib/strings';

const getExistenceQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })

	RETURN n
`;

const getDuplicateNameCountQuery = (model, uuid) => `
	MATCH (n:${capitalise(model)} { name: $name })
		${uuid
			? 'WHERE n.uuid <> $uuid'
			: ''
		}

	RETURN SIGN(COUNT(n)) AS instanceCount
`;

const getCreateQuery = model => `
	CREATE (n:${capitalise(model)} { uuid: $uuid, name: $name })

	WITH n

	${getEditQuery(model)}
`;

const getEditQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })

	RETURN
		'${model}' AS model,
		n.uuid AS uuid,
		n.name AS name
`;

const getUpdateQuery = model => `
	MATCH (n:${capitalise(model)} { uuid: $uuid })
		SET n.name = $name

	WITH n

	${getEditQuery(model)}
`;

const getDeleteQuery = model => {

	const label = capitalise(model);

	return `
		MATCH (:${label} { uuid: $uuid })

		OPTIONAL MATCH (deletableInstance:${label} { uuid: $uuid })
			WHERE NOT (deletableInstance)-[]-()

		OPTIONAL MATCH (undeletableInstance:${label} { uuid: $uuid })
			-[]-(undeleteableInstanceAssociate)

		UNWIND
			CASE WHEN undeleteableInstanceAssociate IS NOT NULL
				THEN LABELS(undeleteableInstanceAssociate)
				ELSE [null]
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
				COLLECT(distinctAssociateLabel) AS associatedModels

			DETACH DELETE deletableInstance

			RETURN
				'${model}' AS model,
				CASE WHEN isDeleted
					THEN deletableInstanceName
					ELSE undeletableInstance.name
				END AS name,
				isDeleted,
				associatedModels
	`;

};

const getListQuery = model => {

	const theatreRelationship = (model === 'production')
		? 'OPTIONAL MATCH (n)-[:PLAYS_AT]->(t:Theatre)'
		: '';

	const theatreObject = (model === 'production')
		? ', CASE WHEN t IS NULL THEN null ELSE { model: \'theatre\', uuid: t.uuid, name: t.name } END AS theatre'
		: '';

	return `
		MATCH (n:${capitalise(model)})

		${theatreRelationship}

		RETURN
			'${model}' AS model,
			n.uuid AS uuid,
			n.name AS name
			${theatreObject}

		LIMIT 100
	`;

};

export {
	getExistenceQuery,
	getDuplicateNameCountQuery,
	getCreateQuery,
	getEditQuery,
	getUpdateQuery,
	getDeleteQuery,
	getListQuery
};
