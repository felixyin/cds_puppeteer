'use strict';
const puppeteer = require('puppeteer');
// const sleep = require('sleep');
var sleep = require('thread-sleep');


async function biyingPuppeteer(queryStr, callback, finish) {

    const browser = await puppeteer.launch({
        headless: true,

        args: [
            // '--no-sandbox', '--disable-setuid-sandbox',
            "--window-size=1360,1268"
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({width: 1360, height: 1268});

    await page.goto('http://cn.bing.com/?ensearch=1&FORM=BEHPTB');

    // Type into search box.
    await page.type('#sb_form_q', queryStr);

    const searchSelector = '.sa_sg:nth-child(1)';
    await page.waitForSelector(searchSelector);
    await page.click(searchSelector);

    var isLastPage = false;
    while (!isLastPage) {
        const resultsSelector = '.b_algo a:nth-child(1)';
        await page.waitForSelector(resultsSelector);

        const links = await page.evaluate(resultsSelector => {
            const anchors = Array.from(document.querySelectorAll(resultsSelector));
            return anchors/*.filter(function (anchor) {
                return anchor.href.indexOf('://www.') !== 0;
            })*/.map(anchor => {
                // const title = anchor.textContent.split('|')[0].trim();
                return anchor.href;
            });
        }, resultsSelector);
        callback(links);

        if (links.length < 10) {
            isLastPage = true;
        }

        // sleep.msleep(500);
        sleep(500);
        const nextPageSelector = '.sb_pagN';
        await page.waitForSelector(nextPageSelector);
        await page.click(nextPageSelector);
    }

    // console.log(isLastPage);
    if (isLastPage) {
        finish();
        await browser.close();
    }

}

(async () => {
    await biyingPuppeteer('furniture', function (links) {
        console.log(links.join('\n\n'));
    }, function () {
        console.log('==============================================over ');
    });
})();
