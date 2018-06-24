const _ = require('underscore');
const _date = formatDate(new Date().toLocaleString().substr(0, 10));

function scrape(target, $) {
    let process, articleSelector;
    switch (target) {
        case 'techorange':
            articleSelector = '.entry-header';
            process = techorange;
            break;
        case 'inside':
            articleSelector = '.post_list_item'
            process = inside;
            break;
        case 'technews':
            articleSelector = '.entry-header';
            process = technews;
            break;
        case 'bnext':
            articleSelector = '.item_text_box';
            process = bnext;
            break;
        case 'ithome':
            articleSelector = '.item';
            process = ithome;
            break;
        case 'kopu':
            articleSelector = '.item_inn';
            process = kopu;
        default:
            break;
    }

    return process_base($, process, articleSelector);
}

function getInfo(target) {
    switch (target) {
        case 'techorange':
            return {
                url: 'https://buzzorange.com/techorange/'
            }
            break;
        case 'inside':
            return {
                url: 'https://www.inside.com.tw/',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
                }
            };
        case 'technews':
            return {
                url: 'https://technews.tw/'
            }
        case 'bnext':
            return {
                url: 'https://www.bnext.com.tw/'
            }
        case 'ithome':
            return {
                url: 'https://www.ithome.com.tw/'
            }
        case 'kopu':
            return {
                url: 'https://kopu.chat/'
            }
        default:
            break;
    }
}

function process_base($, process, articleSelector) {
    //console.log($('body').html());
    return _.uniq($(articleSelector).map((i, e) => process(i, e, $))
        .filter((i, e, self) => e).get(), 'detailPageUrl');
}

function techorange(index, element, $) {
    const $this = $(element);
    const $title = $this.find('.entry-title a');
    const titleText = $title.text();
    if (titleText) {
        return {
            title: titleText,
            detailPageUrl: $title.attr('href'),
            date: formatDate($this.find('.entry-date').text())
        };
    } else {
        return undefined;
    }
}

function technews(index, element, $) {
    const $this = $(element);
    const $title = $this.find('.entry-title a');
    const titleText = $title.text();
    if (titleText) {
        return {
            title: titleText,
            detailPageUrl: $title.attr('href'),
            date: formatDate($($this.find('.body')[1]).text())
        };
    } else {
        return undefined;
    }
}

function inside(index, element, $) {
    const $this = $(element);
    const $title = $this.find('.post_title a.js-auto_break_title');
    const titleText = $title.text();
    if (titleText) {
        return {
            title: titleText,
            detailPageUrl: $title.attr('href'),
            date: formatDate($this.find('.post_date').text())
        };
    } else {
        return undefined;
    }
}

function bnext(index, element, $) {
    const $this = $(element);
    const $title = $this.find('a');
    const titleText = $title.text();
    if (titleText) {
        return {
            title: titleText,
            detailPageUrl: $title.attr('href'),
            date: formatDate($this.find('.item_info .td1').text())
        };
    } else {
        return undefined;
    }
}

function ithome(index, element, $) {
    const $this = $(element);
    const $title = $this.find('.title a');
    const titleText = $title.text();
    if (titleText) {
        return {
            title: titleText,
            detailPageUrl: 'https://www.ithome.com.tw' + $title.attr('href'),
            date: formatDate($this.find('.post-at').text())
        };
    } else {
        return undefined;
    }
}

function kopu(index, element, $) {
    const $this = $(element);
    const $title = $this.find('.posttitle a');
    const titleText = $title.text();
    if (titleText) {
        return {
            title: titleText,
            detailPageUrl: $title.attr('href'),
            date: formatDate($this.find('.post-date').text())
        };
    } else {
        return undefined;
    }
}

function formatDate(date) {
    date = date.trim().replace(/\//g, '-');
    const res = /(\d{4})\s*[^\d]\s*(\d{1,2})\s*[^\d]\s*(\d{1,2})/.exec(date);
    if (res) {
        return res[1] + '-' + res[2].padStart(2, '0') + '-' + res[3].padStart(2, '0')
    } else {
        return _date;
    }
}

module.exports = {
    scrape: scrape,
    getInfo: getInfo,
    date: _date,
    targes: ['technews', 'techorange', 'ithome', 'inside', 'bnext', 'kopu']
};