/*
 * Copyright 2021 InsightLabs27
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const AWS = require('aws-sdk');
const s3 = new AWS.S3()
const fs = require("fs");

async function uploadScreenShot( src  , dst,  bucket ) {

    return new Promise((resolve, reject) => {

        (async function() {
            const buffer = await new Promise((resolve, reject) => {
                fs.readFile(src, (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });

            const { Location } = await s3
                .upload({
                    Bucket: bucket, Key: dst, Body: buffer, ACL: "public-read"
                }).promise();

            resolve(Location);
        })();
    });

}

exports.run = async ( src, dst, bucket ) => {
    return await uploadScreenShot( src, dst, bucket );
};
