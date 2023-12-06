const https = require('https');
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('output.json'))

for (let i = 0; i < data.length; i++) {
    const e = data[i];
    const imageUrl = e.img;
    const imageName = e.link.split('/').slice(-1);

    const file = fs.createWriteStream('img/heroes/'  + imageName + '.jpg');

    https.get(imageUrl, response => {
        response.pipe(file);

        file.on('finish', () => {
            file.close();
            console.log(`Image downloaded as ${imageName}`);
        });
    }).on('error', err => {
        fs.unlink(imageName);
        console.error(`Error downloading image: ${err.message}`);
    });
}

