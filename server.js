const fs = require('fs');
const express = require('express');

const getAPIData = require('./script');
const updateOutputFile = require('./converter');

const app = express();
let apiOutput = JSON.parse(fs.readFileSync('apiOutput.json', 'utf8'));

app.get('/overview', function (req, res) {
	res.json(apiOutput);
});

app.get('/day/:timestamp', function (req, res) {
	let date = new Date(parseInt(req.params.timestamp) * 1000);
	date = date.toISOString().split('T')[0];

	res.json(apiOutput[date]);
});

app.get('/range/:startTimestamp/:days', function (req, res) {
	let date = new Date(parseInt(req.params.startTimestamp) * 1000);
	const days = parseInt(req.params.days);

	var output = {};
	for (let i = 0; i < days; i++) {
		const dateString = date.toISOString().split('T')[0];
		output[dateString] = apiOutput[dateString];
		date.setDate(date.getDate() + 1);
	}

	res.json(output);
});

app.get('/update', async function (req, res) {
	const fileName = await getAPIData();
	updateOutputFile(fileName);

	// update apiOutput
	apiOutput = JSON.parse(fs.readFileSync('apiOutput.json', 'utf8'));

	res.json({success: true});
});

app.listen(3001, () => {
	console.log("Server running on port http://localhost:3001");
	console.log("Test routes:");
	console.log("\thttp://localhost:3001/overview");
	console.log("\thttp://localhost:3001/day/1684864270");
	console.log("\thttp://localhost:3001/range/1684864270/7");
});