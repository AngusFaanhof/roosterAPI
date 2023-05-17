// require fs
const fs = require('fs');

const csv = fs.readFileSync('downloads/timetable_2023-05-16.csv', 'utf8');
const lines = csv.split('\n');

// group by date
const grouped = {};
for (let i = 1; i < lines.length - 1; i++) {
	const line = lines[i];
	// console.log(line)
	const cells = line.split(';');
	// console.log(typeof cells[4]);
	const date = cells[4].replace('"', '').replace('"', '');

	if (!grouped[date])
		grouped[date] = [];

	grouped[date].push(cells);
}

console.log(grouped);