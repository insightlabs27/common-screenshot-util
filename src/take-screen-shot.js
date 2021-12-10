/*
 * Copyright 2021 InsightLabs27
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const chromium = require('chrome-aws-lambda');

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

async function takeScreenShot( url, file ) {
    let result = null;
    let browser = null;
    let maxHeight = 800;

    try {
        let viewportSettings = chromium.defaultViewport;
        viewportSettings.width=960;
        viewportSettings.height=600;

        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: viewportSettings,
            executablePath: await chromium.executablePath,
            headless: true,
        });

        const page = await browser.newPage();

        try {
            await page.goto(url, {timeout: 10000,  waitUntil: 'networkidle2' });

            const dimensions = await page.evaluate(() => {
                return {
                    height: document.documentElement.clientHeight,
                    scrollHeight: document.body.scrollHeight,
                    offsetHeight: document.body.offsetHeight,
                    documentOffsetHeight: document.documentElement.offsetHeight,
                    documentScrollHeight: document.documentElement.scrollHeight,
                };
            });
            maxHeight = Math.max( dimensions.height, dimensions.scrollHeight,  dimensions.offsetHeight, dimensions.documentScrollHeight, dimensions.documentOffsetHeight );
            if (maxHeight>5000){ maxHeight=5000; }
        } catch (e){
            console.log('e :: ', e) //todo: place this in a different bucket or save txt file with the error message.
        }

        await page.setViewport( { width:960, height: maxHeight })
        await page.screenshot({ path: file, quality:20,  type: 'jpeg' });

        result=file;
    } catch (error) {
        return error;
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }

    return result;
}

exports.run = async ( url, file ) => {
    return await takeScreenShot( url, file );
};
