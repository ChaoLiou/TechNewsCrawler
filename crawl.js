const scraperjs = require('scraperjs');
const fs = require('fs');

const manager = require('./manager.js');
const date = manager.date;

const folderRoot = './news';

manager.targets.forEach(target => main(target));

function main(target) {
    const info = manager.getInfo(target);

    scraperjs.StaticScraper.create({ url: info.url, headers: info.headers })
        .scrape(($) => manager.scrape(target, $))
        .then((newsList) => {
            if (newsList && newsList.length > 0) {
                const folder = folderRoot + '/' + target
                const json = folder + '/' + date + '.json';
                if (!fs.existsSync(folderRoot)) {
                    fs.mkdirSync(folderRoot);
                }
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder);
                }

                fs.writeFileSync(json, JSON.stringify({ newsList: newsList }));
                console.log(target);
            }
        });
}