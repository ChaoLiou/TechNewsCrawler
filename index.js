const scraperjs = require('scraperjs');
const fs = require('fs');
const args = require('args');

const manager = require('./manager.js');
const date = manager.date;

args.option('target', 'target');
const flags = args.parse(process.argv)

if (flags.target) {
    scrape(flags.target);
} else {
    manager.targes.forEach(target => scrape(target));
}

function scrape(target) {
    const info = manager.getInfo(target);
    const url = info.url;

    scraperjs.StaticScraper.create({ url: info.url, headers: info.headers })
        .scrape(($) => manager.scrape(target, $))
        .then(function (news) {
            console.log(news);

            if (news && news.length > 0) {
                const folder = './news/' + target
                const json = folder + "/" + date + '.json';
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder);
                }

                fs.writeFile(json, JSON.stringify(news), (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    };
                });
            }
        })
}