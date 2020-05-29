const puppeteer = require('puppeteer');
const neatCsv = require('neat-csv');
const fs = require('fs');
const fastcsv = require('fast-csv');
/*
Mac terminal command
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')
*/
//TESTING
// const YO_SCOTT_DISCORD_PAGE = "https://discord.com/channels/707735725763854416/707735725763854419"
//REAL
const YO_SCOTT_DISCORD_PAGE = "https://discord.com/channels/590298536713781258/684186666432331787"
const YO_SCOTT_TEXTBOX = "Message #yoscott"
const YO_SCOTT_PHRASE = "YO SCOTT! Stay awesome, stay happy, stay comfy you all! - scott bot"
let LOGIN_SUCCESS = true
const wsEndpoint = "ws://127.0.0.1:9222/devtools/browser/5cb87e9f-9b76-4578-a02c-01b6713595f6"
async function startBrowser() {
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsEndpoint,
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto(YO_SCOTT_DISCORD_PAGE)
    await page.waitFor(1000);
    let streakCount = await readCSV()
    let phraseToType = YO_SCOTT_PHRASE

    await page.keyboard.type(phraseToType);
    await page.keyboard.down("Shift")
    await page.keyboard.press("Enter")
    await page.keyboard.up("Shift")
    await page.keyboard.type("STREAK: " + streakCount);
    await page.keyboard.press("Enter")
    //EXIT THE PAGE


}

//FUNCTION TO HANDLE CSV
async function readCSV() {
    return new Promise(function (resolve, reject) {
        fs.readFile('./streak.csv', async (err, data) => {
            if (err) {
                console.error(err)
                reject(err)
                return
            }
            let streakObj = await neatCsv(data)
            streakObj[0]["Streak Count"] = parseInt(streakObj[0]["Streak Count"]) + 1
            const ws = fs.createWriteStream("streak.csv");
            fastcsv
                .write(streakObj, { headers: true })
                .pipe(ws);
            resolve(streakObj[0]["Streak Count"])
        })
    })
}

startBrowser()
