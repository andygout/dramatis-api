const fs = require('fs');
const path = require('path');

const directly = require('directly');

const BASE_URL = 'http://localhost:3000';

async function performFetch (url, instance) {

	const settings = {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(instance)
	}

	const response = await fetch(url, settings);

	if (response.status !== 200) throw new Error(response.statusText);

	return;

};

async function seedInstances (directoryName, modelUrlRoute) {

	const directoryPath = path.join(__dirname, `seeds/${directoryName}`);

	const seedFilenames = fs.readdirSync(directoryPath);

	const createInstanceFunctions =
		seedFilenames
			.map(filename => () => {

				try {

					const rawData = fs.readFileSync(`${directoryPath}/${filename}`);

					const instance = JSON.parse(rawData);

					const url = `${BASE_URL}/${modelUrlRoute}`;

					return performFetch(url, instance);

				} catch (error) {

					throw new Error(`${directoryName}/${filename}: ${error.message}`);

				}

			});

	await directly(1, createInstanceFunctions);

	return;

};

async function seedDatabase () {

	console.log('Seeding Neo4j database: Commenced'); // eslint-disable-line no-console

	await seedInstances('venues', 'venues');

	console.log('Seeding Neo4j database: Venue seeds sown'); // eslint-disable-line no-console

	await seedInstances('materials', 'materials');

	console.log('Seeding Neo4j database: Material seeds sown'); // eslint-disable-line no-console

	await seedInstances('productions', 'productions');

	console.log('Seeding Neo4j database: Production seeds sown'); // eslint-disable-line no-console

	await seedInstances('award-ceremonies', 'award-ceremonies');

	console.log('Seeding Neo4j database: Award ceremony seeds sown'); // eslint-disable-line no-console

	console.log('Seeding Neo4j database: Complete'); // eslint-disable-line no-console

	return;

};

seedDatabase();
