const fs = require('fs');
const express = require('express');

const getAPIData = require('./script');
const updateOutputFile = require('./converter');

const app = express();
let apiOutput = JSON.parse(fs.readFileSync('apiOutput.json', 'utf8'));

app.get('/overview', function (req, res) {
	res.json(apiOutput);
});

app.get('/day/:date', function (req, res) {
	const date = req.params.date;

	res.json(apiOutput[date]);
});

app.get('/range/:startDate/:days', function (req, res) {
	let date = new Date(req.params.startDate);
	const days = req.params.days;

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
});