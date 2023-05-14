const puppeteer = require('puppeteer');
const loginDetails = require('./loginDetails.json');

async function getAPIData() {
	const browser = await puppeteer.launch({
		// headless: false,
		headless: "new",
		args: ['--disable-web-security', '--disable-features=IsolateOrigins', ' --disable-site-isolation-trials'],
	});

	const page = await browser.newPage();
	await page.goto('https://rooster.vu.nl/schedule', { waitUntil: 'networkidle2' });

	// set download path
	const client = await page.target().createCDPSession();
	await client.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: './downloads',
	});

	// close popup
	await page.waitForSelector('.gwt-PopupPanel');
	await page.$eval('.gwt-PopupPanel button', button => button.click());
	await page.$eval('a[title="Log in"]', button => button.click());

	// login
	await page.waitForSelector('#userNameInput')
	await page.type('#userNameInput', loginDetails.username);
	await page.type("#passwordInput", loginDetails.password);
	await page.$eval('#submitButton', button => button.click());

	// download schedule csv (no other indicators available)
	await page.waitForSelector('.sidebar-content-panel-buttons');
	const sidebarButtons = await page.$$('.sidebar-content-panel-buttons button');
	await sidebarButtons[1].click();

	// select CSV option
	// NOTE: not sure why .map(option => option) is required
	await page.waitForSelector('.GNKVYU1P2');
	await page.$$eval(
		'.GNKVYU1P2 span',
		options => options.map(option => option).filter(option => option.textContent == 'CSV')[0].click()
	);

	// select all year option
	await page.waitForSelector('.GNKVYU1N1.GNKVYU1O1');
	await page.$$eval(
		'.GNKVYU1N1.GNKVYU1O1 span',
		options => options.map(option => option).filter(option => option.textContent.includes('All year'))[0].click()
	);

	// press final download button
	await page.waitForSelector('.GNKVYU1HO');
	await page.$eval('.GNKVYU1HO button', button => button.click());
	await new Promise(r => setTimeout(r, 1000)); // wait for download to finish

	browser.close();

	return {

	};
}

getAPIData();
