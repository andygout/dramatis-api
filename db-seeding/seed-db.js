const fs = require('fs');
const path = require('path');

const directly = require('directly');
const nodeFetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function performFetch (url, instance) {

	const settings = {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(instance)
	}

	const response = await nodeFetch(url, settings);

	if (response.status !== 200) throw new Error(response.statusText);

	return;

};

async function seedInstances (pluralisedModel) {

	const seedsPath = path.join(__dirname, `seeds/${pluralisedModel}`);

	const seedFilenames = fs.readdirSync(seedsPath);

	const createInstanceFunctions =
		seedFilenames
			.map(filename => async () => {
				const rawData = fs.readFileSync(`${seedsPath}/${filename}`);

				const instance = JSON.parse(rawData);

				const url = `${BASE_URL}/${pluralisedModel}`;

				await performFetch(url, instance);

				return;

			});

	await directly(1, createInstanceFunctions);

	return;


};

async function seedDatabase () {

	await seedInstances('playtexts');

	await seedInstances('productions');

	return;

};

seedDatabase();
