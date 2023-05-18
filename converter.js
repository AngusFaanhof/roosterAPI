// require fs
const fs = require('fs');

const csv = fs.readFileSync('downloads/timetable_2023-05-16.csv', 'utf8').split('"').join("");

function csvToApi(csv) {
	const lines = csv.split('\n');
	const apiOutput = {};

	for (let i = 1; i < lines.length - 1; i++) {
		const cells = lines[i].split(';');

		const startDate = cells[4];
		const startTime = cells[5];

		const endDate = cells[7];
		const endTime =  cells[8];

		const lineData = {
			"description": cells[0],
			"courseCode": cells[1],
			"start": new Date(`${startDate}T${startTime}Z`),
			"end": new Date(`${endDate}T${endTime}Z`),
			"duration": cells[9],
			"type": cells[10],
			"teachers": cells[11].split('.,'),
			"locations": cells[12].split(','),
			"online": cells[19] == "Ja"
		}

		if (!apiOutput[startDate])
			apiOutput[startDate] = [];

		apiOutput[startDate].push(lineData);
	}

	return apiOutput;
}

const data = csvToApi(csv);

// console.log()