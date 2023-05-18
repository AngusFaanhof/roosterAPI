const express = require('express');
const fs = require('fs');

const app = express();

app.get('/overview', function (req, res) {
	const apiOutput = JSON.parse(fs.readFileSync('apiOutput.json', 'utf8'));
	res.json(apiOutput);
});

app.listen(3000, () => {
	console.log("Server running on port http://localhost:3000");
});