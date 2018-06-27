const fs = require('fs');
const nodejieba = require("nodejieba");
nodejieba.load({ dict: './dict/zhTW.txt' });
const _ = require('underscore');

const manager = require('./manager.js');
const date = manager.date;

const stopwords = require('./dict/stopwords.js')

const folderRoot = './news';
const list = [];

main();

function main() {
    manager.targets.forEach((target) => {
        const files = fs.readdirSync(folderRoot + '/' + target + '/');
        files.forEach((file) => {
            const data = fs.readFileSync(folderRoot + '/' + target + '/' + file);
            const json = JSON.parse(data);
            json.newsList.forEach((news) => {
                const words = nodejieba.cutForSearch(news.title);
                words.forEach((word) => {
                    try {
                        if ((/^[\u4E00-\u9FA5]{2,}$/.test(word) || /^[a-zA-Z\s]{2,}$/.test(word))
                            && !_.find(stopwords.list, (w) => w == word)) {
                            const item = _.find(list, (obj) => obj.text == word);
                            if (item) {
                                item.count++;
                                if (!_.contains(item.newsList, news)) {
                                    item.newsList.push(news);
                                }
                            } else {
                                list.push({ text: word, count: 1, newsList: [news] });
                                // list.push({ text: word, count: 1, urls: [news.detailPageUrl] });
                            }
                        }
                    } catch (error) {
                        console.log(word);
                    }
                });
            });
        });
        console.log(target);
    });

    fs.writeFileSync("./list.json", JSON.stringify({ list: _.sortBy(list, 'count').reverse() }));
}