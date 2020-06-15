'use strict';
const puppeteer = require('puppeteer');
const UserAgent = require('user-agents');
// const sleep = require('sleep');
// const sleep = require('thread-sleep');
// const proxyPool = require('./proxypool');


async function launchBrowser() {
    // const p = await proxyPool.getProxy();
    // console.log('----->', p);
    const browser = await puppeteer.launch({
        // headless: false,
        headless: true,
        args: [
            "--window-size=2360,968",
            '--no-sandbox',
            '--disable-setuid-sandbox',
            // `--proxy-server=${p}`
        ]
    });
    return browser;
}


let browser;

async function biyingPuppeteer(queryStr, callback, finish, browseredCb) {

    try {
        if (!browser) {
        browser = await launchBrowser();
        }

        const page = await browser.newPage();
        browseredCb(page);

        const userAgent = new UserAgent();
        console.log(userAgent.toString());
        await page.setUserAgent(userAgent.toString());

        await page.setViewport({width: 1360, height: 968});

        await page.waitFor(1000);
        await page.goto('http://cn.bing.com/?ensearch=1');

        await page.waitFor(1000);
        // Type into search box.
        console.log('search str: '+queryStr);
        await page.type('#sb_form_q', queryStr);
        await page.waitFor(1000);
        // 回车
        await page.keyboard.press('Enter');

        // const searchSelector = '.sa_sg:nth-child(1)';
        // await page.waitForSelector(searchSelector);
        // await page.click(searchSelector);

        const urls = [];

        let isLastPage = false;
        while (!isLastPage) {
            const _url = await page.url();
            console.log(_url);
            for (const i in urls) {
                const url = urls[i];
                if (url === _url) {
                    // 最后一页
                    isLastPage = true;

                    await page.close();
                }
            }
            urls.push(_url);


            const resultsSelector = '.b_algo a:nth-child(1)';
            await page.waitForSelector(resultsSelector);

            const links = await page.evaluate(resultsSelector => {
                const anchors = Array.from(document.querySelectorAll(resultsSelector));
                return anchors.filter(function (anchor) {
                    return anchor.href.indexOf('://www.') !== 0;
                }).map(anchor => {
                    // const title = anchor.textContent.split('|')[0].trim();
                    return anchor.href;
                });
            }, resultsSelector);
            callback(links);

            if (links.length < 3) {
                isLastPage = true;
                await page.close();
            }

            // sleep.msleep(1000);
            // await page.wait(1000);
            // sleep(5000);
            await page.waitFor(1000 * 7);
            const nextPageSelector = '.sb_pagN';
            await page.waitForSelector(nextPageSelector);
            await page.click(nextPageSelector);
        }


        console.log(isLastPage);
        if (isLastPage) {
            finish();
            await page.close();
        }
    } catch (e) {
        finish();
    }
    // return browser;
}

exports.biyingSearch = biyingPuppeteer;
/*

(async () => {
    await googlePuppeteer('furniture', function (links) {
        console.log(links.join('\n\n'));
    }, function () {
        console.log('==============================================over ');
    });
})();
*/
