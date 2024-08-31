import fetch from 'node-fetch';
import AWS from 'aws-sdk';

const putObject = (uploadParams) =>
  new Promise((resolve, reject) => {
    AWS.config.update({ region: 'us-east-1' });

    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    s3.putObject(uploadParams, function (err, data) {
      if (err) {
        console.log('Error', err);
        reject(err);
      }
      if (data) {
        console.log('Upload Success', data.Location);
        resolve(data);
      }
    });
  });

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event, context) => {
  const exampleResponse = await fetch('https://example.com/');
  const exampleBody = await exampleResponse.text();

  const uploadParams = {
    Bucket: 'upload-market-schedule',
    Key: 'foo',
    Body: exampleBody,
  };

  await putObject(uploadParams);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: exampleBody,
    }),
  };

  return response;
};
