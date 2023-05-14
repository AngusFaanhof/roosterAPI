const puppeteer = require('puppeteer');
const loginDetails = require('./loginDetails.json');

async function getAPIData() {
	const browser = await puppeteer.launch({
		headless: false,
		// headless: "new",
		args: ['--disable-web-security', '--disable-features=IsolateOrigins', ' --disable-site-isolation-trials'],
	});

	const page = await browser.newPage();
	await page.goto('https://rooster.vu.nl/schedule', { waitUntil: 'networkidle2' });

	// close popup
	await page.waitForSelector('.gwt-PopupPanel');
	await page.$eval('.gwt-PopupPanel button', button => button.click());
	await page.$eval('a[title="Log in"]', button => button.click());

	// login
	await page.waitForSelector('#userNameInput')
	await page.type('#userNameInput', loginDetails.username);
	await page.type("#passwordInput", loginDetails.password);
	await page.$eval('#submitButton', button => button.click());


	let apiResponse = {

	};

	return apiResponse;
}

getAPIData();
