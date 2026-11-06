import { neo4jQuery } from './query.js';

const createSpatialWktLayer = async () => {
	const createSpatialWktLayerQuery = `
		OPTIONAL MATCH (layer:SpatialLayer { layer: 'place-geometries' })

		WITH layer

		WHERE layer IS NULL CALL spatial.addWKTLayer('place-geometries', 'geometryWkt')
		
		YIELD node

		RETURN node;
	`;

	console.log('🟢 Neo4j database: Creating spatial WKT layer…'); // eslint-disable-line no-console

	await neo4jQuery(
		{
			query: createSpatialWktLayerQuery,
			params: {}
		},
		{
			isOptionalResult: true
		}
	);

	console.log(`✔️  Neo4j database: Spatial WKT layer created`); // eslint-disable-line no-console
};

export default createSpatialWktLayer;
