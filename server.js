const express = require('express');
const getAPIData = require('./script');
const updateOutputFile = require('./converter');

const fs = require('fs');

const app = express();

app.get('/overview', function (req, res) {
	const apiOutput = JSON.parse(fs.readFileSync('apiOutput.json', 'utf8'));
	res.json(apiOutput);
});

app.get('/day/:date', function (req, res) {
	const apiOutput = JSON.parse(fs.readFileSync('apiOutput.json', 'utf8'));
	const date = req.params.date;
	res.json(apiOutput[date]);
});

app.get('/range/:startDate/:days', function (req, res) {
	const apiOutput = JSON.parse(fs.readFileSync('apiOutput.json', 'utf8'));
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

	res.json({success: true});
});

// TODO: Implement
app.get('/range/:startDate/:endDate', function (req, res) {

});


app.listen(3000, () => {
	console.log("Server running on port http://localhost:3000");
});