/*
 * Copyright 2021 InsightLabs27
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 *
 *  zip /common-screenshot-util/lambda/lambda-screenshot-function.zip take-screen-shot.js upload-screen-shot.js lambda-index.js
 *
 *  aws lambda create-function \
 *    --function-name lambda-screenshot-function \
 *    --runtime nodejs12.x \
 *    --zip-file fileb://lambda-screenshot-function.zip \
 *    --handler lambda-index.handler \
 *    --layers arn:aws:lambda:us-east-1:[id]:layer:chrome-mods:1 \
 *    --role arn:aws:iam::[id]:role/service-role/test1-role-[id]
 *
 * aws lambda update-function-code \
 *    --function-name  lambda-screenshot-function \
 *    --zip-file fileb://lambda-screenshot-function.zip
 *
 * https://s3.console.aws.amazon.com/s3/buckets/screenshot/?region=us-east-1
 *
 * aws lambda invoke --function-name lambda-screenshot-function response.txt --payload '{ "url": "https://www.google.com", "file": "test/screenshot.jpeg" }'  --log-type Tail
 *
 * base64 -D tmp,in -o tmp.out
 *
 */

const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const takeScreenShot = require("./take-screen-shot");
const uploadScreenShot = require("./upload-screen-shot");
const getScreenShot = require("./get-screen-shot");
const lambda = new AWS.Lambda();

async function invokeLambda( params ) {
    return new Promise((resolve, reject) => {
        lambda.invoke(params, (error, data) => {
             (error) ?  reject(error) :  resolve(data);
        });
    }).catch(function(error) {
        //todo handle an error when invoke lamba fails for whatever reason.
        console.log('handle error ', error);
    });
}

module.exports = {

    exec: async function( args ){
        return  (args.env==='local') ? await this.localScreenShot( args ) : await this.lambdaScreenShot( args );
    },

    localScreenShot: async function(args){
        let takeResult, uploadResult;
        takeResult =  await takeScreenShot.run( args.url, args.file )
        if (args.uploadToS3){
            uploadResult = await this.uploadScreenShot( {src: takeResult, name: args.name,  bucket:args.bucket})
        }
        return { take: takeResult, upload: uploadResult };
    },


    lambdaScreenShot: async function(args){
        console.log('args :: ', args);
        const params = {
            FunctionName: 'lambda-screenshot-function',
            Payload: JSON.stringify({ url: args.url, file:args.file, bucket:args.bucket }),
        };

        return await invokeLambda( params );
    },

    uploadScreenShot: async function(args){
        return await uploadScreenShot.run(args.src, args.name, args.bucket );
    },

    getScreenShot: async function(args){
        return await getScreenShot.run(args.key, args.bucket);
    }

};
