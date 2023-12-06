const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    let url = 'https://www.dc.com/characters?page='
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    const num = 14
    let data = []
    for (let i = 1; i < num; i++) {
        await page.goto(url + i)

        let heroesData = await page.evaluate(() => {
            let heroData = [];
            //
            let heroSelector = '#page-band-column1 > div > div.sc-1q6k1vi-0.jBCIXF.container-fluid.px-0.content-grid.col-count-sm-2.col-count-md-3.col-count-lg-4 > div.row > div'
            let hero = document.querySelectorAll(heroSelector)

            hero.forEach((h) => {
                let dataJson = {};
                try {
                    dataJson.link = h.querySelector('div > a').href
                    dataJson.img = h.querySelector('div > img').src                }
                catch (err) {
                    console.log(err)
                }
                heroData.push(dataJson);
            });
            return heroData;
        });
        data.push(...heroesData)
    }

    console.log(data.length);

    fs.writeFile("output.json", JSON.stringify(data), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.")
            return console.log(err);
        }

        console.log("JSON file has been saved.")
    });

    await browser.close()
})();
