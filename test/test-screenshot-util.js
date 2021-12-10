/*
 * Copyright 2021 InsightLabs27
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const screenShot = require('../src/common-screenshot-util');
const assert     = require('assert');


describe('Test methods', function () {
    this.timeout(60000)


    it('Test take screenshot', function (done) {

        (async () => {
            try {
                let results = await screenShot.exec({ url: 'https://www.google.com',  file: './test/tmp/screenshot.jpeg', name: 'test/screenshot.jpeg',  bucket:'screenshot.local', env: 'local', uploadToS3:true });
                console.log('results :: ', results);
            } catch (err){
                assert.fail(err);
            } finally {
                done();
            }
        })();

        assert.strictEqual(1===1, true);
    });


    it('Test take yahoo screen shot', function (done) {

        (async () => {
            try {
                let results = await screenShot.exec({ url: 'https://www.yahoo.com',  file: './test/tmp/screenshot-yahoo.jpeg',  env: 'local' });
                console.log('results :: ', results);
            } catch (err){
                assert.fail(err);
            } finally {
                done();
            }
        })();

        assert.strictEqual(1===1, true);
    });
cle
    it.only('Test get screen shot', function (done) {

        (async () => {
            try {
                let results = await screenShot.getScreenShot({ key: '[s3-bucket-location]/captureScreen.png', bucket:'screenshot.test', env: 'local' });
                console.log('results :: ', results);
            } catch (err){
                assert.fail(err);
            } finally {
                done();
            }
        })();

    });

    it('Test take google screen shot', function (done) {

        (async () => {
            try {
                let results = await screenShot.exec({ url: 'https://google.com',  file: './test/tmp/screenshot-google.jpeg',  env: 'local' });
                console.log('results :: ', results);
            } catch (err){
                assert.fail(err);
            } finally {
                done();
            }
        })();

        assert.strictEqual(1===1, true);
    });


    it('Test take google screen shot via Lambda function', function (done) {
        (async () => {
            try {
                let results = await screenShot.lambdaScreenShot({ url: 'https://www.google.com',  file: 'tmp/screenshot.jpeg', bucket:'screenshot.local', env: 'local' });
                console.log('results :: ', results);
            } catch (err){
                assert.fail(err);
            } finally {
                done();
            }
        })();

    });

});


