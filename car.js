const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    let url = 'https://www.cars-data.com/en/all-cars/page1.html'

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    const num = 98
    let data = []
    for (let i = 1; i < num; i++) {
        await page.goto(url.replace('page1', `page${i}`))

        let carsData = await page.evaluate(() => {
            let carData = [];
            //
            let carSelector = 'section.models > div.col-4'
            let car = document.querySelectorAll(carSelector)

            car.forEach((c) => {
                let dataJson = {};
                try {
                    dataJson.link = c.querySelector('div > a').href
                    dataJson.name = c.querySelector('div > a').title
                    dataJson.image = c.querySelector('div > a > img').src
                    const desc = c.querySelector('div > p').innerText.split(/\n|,/)
                    dataJson.years = desc[0]
                    dataJson.doors = desc[1]
                    dataJson.type = desc[2]         
                }
                catch (err) {
                    console.log(err)
                }
                carData.push(dataJson);
            });
            return carData;
        });
        data.push(...carsData)
    }

    console.log(data.length);

    fs.writeFile("cars.json", JSON.stringify(data), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.")
            return console.log(err);
        }

        console.log("JSON file has been saved.")
    });

    await browser.close()
})();
