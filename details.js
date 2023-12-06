const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    const data = fs.readFileSync('output.json')

    let jsonData = JSON.parse(data)
    for (let i = 0; i < jsonData.length; i++) {
        let e = jsonData[i];
        //
        console.log(e.link)
        await page.goto(e.link)

        let heroesData = await page.evaluate(() => {
            let heroData = [];
            //hero intro
            let heroSelector = '#page99-band6808-Text6809 > div'
            let hero = document.querySelectorAll(heroSelector)

            hero.forEach((h) => {
                let dataJson = {};
                try {
                    dataJson.name = h.querySelector('h1').innerText
                    dataJson.allText = h.innerText.replaceAll('\n', ' ')
                }
                catch (err) {
                    console.log(err)
                }
                heroData.push(dataJson);
            });
            //hero facts
            let factsArr = [];
            let factSelector = 'div.container > div > div > div > div > div.sc-b3fnpg-1.zRQfB'
            let facts = document.querySelectorAll(factSelector)

            facts.forEach((h) => {
                let dataJson = {};
                try {
                    dataJson.fact = h.querySelector('div.sc-b3fnpg-2.bAcwzp').innerText
                    dataJson.factValues = h.querySelector('div.sc-b3fnpg-3.bFLYOF').innerText
                }
                catch (err) {
                    console.log(err)
                }
                factsArr.push(dataJson);
            });
            if(heroData.length > 0 )
                heroData[0].facts = factsArr

            return heroData;
        });
        //
        e.data = heroesData
        jsonData[i] = e
    }

    // write file 
    fs.writeFile("hero_data.json", JSON.stringify(jsonData), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.")
            return console.log(err);
        }

        console.log("JSON file has been saved.")
    });

    await browser.close()
})();
