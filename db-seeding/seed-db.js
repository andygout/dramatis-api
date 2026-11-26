import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url); // eslint-disable-line no-underscore-dangle
const __dirname = path.dirname(__filename); // eslint-disable-line no-underscore-dangle

import jsonlint from 'jsonlint';

import localesQuery from './seed-queries/locales.js';
import placesQuery from './seed-queries/places.js';
import { getDriver } from '../src/neo4j/get-driver.js';
import { neo4jQuery } from '../src/neo4j/query.js';

const BASE_URL = 'http://localhost:3000';

const PLURALISED_MODEL_TO_EMOJI_MAP = {
	'award-ceremonies': '🏆',
	festivals: '🎪',
	locales: '🏡',
	materials: '📖',
	places: '🌍',
	productions: '🎭',
	times: '🕰',
	venues: '🏛️'
};

const PAUSE_DURATION_IN_MILLISECONDS = 500;

const pause = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

async function performFetch(url, instance, modelEmoji, filenamePathSlug) {
	const settings = {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(instance)
	};

	await pause(PAUSE_DURATION_IN_MILLISECONDS);

	const response = await fetch(url, settings);

	if (response.status !== 200) throw new Error(response.statusText);

	const responseJson = await response.json();

	const resultIndicator = responseJson.hasErrors ? '❌' : '✅';

	// eslint-disable-next-line no-console
	console.log(`${resultIndicator} Seeding Neo4j database: ${modelEmoji} ${filenamePathSlug}`);

	return;
}

async function seedInstances(pluralisedModel) {
	const directoryName = pluralisedModel;
	const modelUrlRoute = pluralisedModel;

	const modelEmoji = PLURALISED_MODEL_TO_EMOJI_MAP[pluralisedModel];

	const directoryPath = path.join(__dirname, `seeds/${directoryName}`);

	const seedFilenames = fs.readdirSync(directoryPath);

	// eslint-disable-next-line no-console
	console.log(
		`🟢 Seeding Neo4j database: ${modelEmoji} Commenced sowing ${seedFilenames.length} ${pluralisedModel} seeds`
	);

	for (const filename of seedFilenames) {
		const filenamePathSlug = `${directoryName}/${filename}`;

		let instance;

		try {
			const rawData = fs.readFileSync(`${directoryPath}/${filename}`);

			try {
				// Parse with jsonlint rather than JSON.parse() because
				// its errors specify the line of parse errors.
				instance = jsonlint.parse(rawData.toString());
			} catch (parsingError) {
				// eslint-disable-next-line no-console
				console.log(`❌ Seeding Neo4j database: ${modelEmoji} ${filenamePathSlug}`);
				// eslint-disable-next-line no-console
				console.log(parsingError);

				continue;
			}
		} catch (error) {
			throw new Error(`${filenamePathSlug}: ${error.message}`, { cause: error });
		}

		const url = `${BASE_URL}/${modelUrlRoute}`;

		await performFetch(url, instance, modelEmoji, filenamePathSlug);
	}

	// eslint-disable-next-line no-console
	console.log(`✔️  Seeding Neo4j database: ${modelEmoji} Finished sowing ${pluralisedModel} seeds`);

	return;
}

async function seedDatabase() {
	// eslint-disable-next-line no-console
	console.log('🟢 Seeding Neo4j database: Commenced');

	await seedInstances('festivals');

	await seedInstances('venues');

	await seedInstances('times');

	// eslint-disable-next-line no-console
	console.log(`🟢 Seeding Neo4j database: ${PLURALISED_MODEL_TO_EMOJI_MAP['places']} Commenced sowing place seeds`);

	await neo4jQuery({ query: placesQuery() }, { isOptionalResult: true });

	// eslint-disable-next-line no-console
	console.log(`✔️  Seeding Neo4j database: ${PLURALISED_MODEL_TO_EMOJI_MAP['places']} Place seeds sown`);

	// eslint-disable-next-line no-console
	console.log(`🟢 Seeding Neo4j database: ${PLURALISED_MODEL_TO_EMOJI_MAP['locales']} Commenced sowing locale seeds`);

	await neo4jQuery({ query: localesQuery() }, { isOptionalResult: true });

	// eslint-disable-next-line no-console
	console.log(`✔️  Seeding Neo4j database: ${PLURALISED_MODEL_TO_EMOJI_MAP['locales']} Locale seeds sown`);

	await seedInstances('materials');

	await seedInstances('productions');

	await seedInstances('award-ceremonies');

	// eslint-disable-next-line no-console
	console.log('🆗 Seeding Neo4j database: Complete');

	return;
}

try {
	await seedDatabase();
} finally {
	await getDriver().close();
}
