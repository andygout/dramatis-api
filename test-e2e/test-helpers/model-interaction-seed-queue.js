import prepareAsParams from '../../src/lib/prepare-as-params.js';
import { AwardCeremony, Festival, Material, Production, Venue } from '../../src/models/index.js';
import { getCreateQueries, sharedQueries } from '../../src/neo4j/cypher-queries/index.js';
import { neo4jQuery } from '../../src/neo4j/query.js';
import { MODELS } from '../../src/utils/constants.js';

const PATH_TO_MODEL_MAP = new Map([
	['/award-ceremonies', MODELS.AWARD_CEREMONY],
	['/festivals', MODELS.FESTIVAL],
	['/materials', MODELS.MATERIAL],
	['/productions', MODELS.PRODUCTION],
	['/venues', MODELS.VENUE]
]);

const MODEL_TO_CLASS_MAP = new Map([
	[MODELS.AWARD_CEREMONY, AwardCeremony],
	[MODELS.FESTIVAL, Festival],
	[MODELS.MATERIAL, Material],
	[MODELS.PRODUCTION, Production],
	[MODELS.VENUE, Venue]
]);

const MODEL_TO_QUERY_SCOPE_VARIABLE_MAP = new Map([
	[MODELS.AWARD_CEREMONY, 'ceremony'],
	[MODELS.FESTIVAL, 'festival'],
	[MODELS.MATERIAL, 'material'],
	[MODELS.PRODUCTION, 'production'],
	[MODELS.VENUE, 'venue']
]);

let queuedSeeds = [];

const seedQueryByModel = new Map();

const replaceQueryParamsWithRowProperties = (query) =>
	query.replace(/\$([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*)/g, 'row.$1');

const preserveRowAcrossWithClauses = (query) =>
	query
		.replace(/^(\s*)WITH DISTINCT\s+/gm, '$1WITH DISTINCT row, ')
		.replace(/^(\s*)WITH\s*$/gm, '$1WITH\n$1\trow,')
		.replace(/^(\s*)WITH\s+(?!row\b|DISTINCT row\b)/gm, '$1WITH row, ');

const stripEditQuery = (model, query) => {
	const scopeVariable = MODEL_TO_QUERY_SCOPE_VARIABLE_MAP.get(model);
	const finalWithClause = `WITH DISTINCT ${scopeVariable}`;
	const finalWithClauseIndex = query.lastIndexOf(finalWithClause);

	if (finalWithClauseIndex === -1) return query;

	return `${query.slice(0, finalWithClauseIndex)}

		RETURN 1 AS seeded
	`;
};

const getCreateQuery = (model) => {
	const createQueryFactory = getCreateQueries[model] || sharedQueries.getCreateQuery;

	return replaceQueryParamsWithRowProperties(
		preserveRowAcrossWithClauses(stripEditQuery(model, createQueryFactory(model)))
	);
};

const getSeedQuery = (model) => {
	if (!seedQueryByModel.has(model)) {
		seedQueryByModel.set(
			model,
			`
				UNWIND $rows AS seedRow

				WITH seedRow
					ORDER BY seedRow.position

				CALL {
					WITH seedRow

					WITH seedRow.params AS row

					${getCreateQuery(model)}
				}

				RETURN COUNT(*) AS count
			`
		);
	}

	return seedQueryByModel.get(model);
};

const getSeedChunks = () => {
	return queuedSeeds.reduce((chunks, seed) => {
		const currentChunk = chunks.at(-1);

		if (currentChunk?.model === seed.model) {
			currentChunk.seeds.push(seed);
		} else {
			chunks.push({ model: seed.model, seeds: [seed] });
		}

		return chunks;
	}, []);
};

const queueModelInteractionSeed = (path, body) => {
	const model = PATH_TO_MODEL_MAP.get(path);

	if (!model) throw new Error(`Unsupported model-interaction seed path: ${path}`);

	const Class = MODEL_TO_CLASS_MAP.get(model);
	const instance = new Class(body);

	if (model === MODELS.AWARD_CEREMONY) {
		prepareAsParams(instance);
	}

	queuedSeeds.push({
		model,
		params: prepareAsParams(instance)
	});
};

const clearModelInteractionSeedQueue = () => {
	queuedSeeds = [];
};

const flushModelInteractionSeedQueue = async () => {
	if (!queuedSeeds.length) return;

	const seedChunks = getSeedChunks();

	clearModelInteractionSeedQueue();

	for (const { model, seeds } of seedChunks) {
		await neo4jQuery(
			{
				query: getSeedQuery(model),
				params: {
					rows: seeds.map((seed, position) => ({
						position,
						params: seed.params
					}))
				}
			},
			{ isOptionalResult: true }
		);
	}
};

export { clearModelInteractionSeedQueue, flushModelInteractionSeedQueue, queueModelInteractionSeed };
