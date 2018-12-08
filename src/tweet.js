require('dotenv').config();

const jwt = require('jsonwebtoken');

const { parsePayloadContent, validateRequest, handleSuccess, handleError } = require('../lib/request');
const { buildTweet, tweet } = require('../lib/twitter');

/**
 * handler
 * @description Lambda handler
 */

function handler({ headers, body}, context, callback) {

  try {
    validateRequest(process, headers);
  } catch(e) {
    handleError(callback, e);
  }

  const content = parsePayloadContent(body);

  let options = {};

  options.config = jwt.verify(headers.authorization, process.env.APP_SECRET);
  options = Object.assign({}, options, {
    ...buildTweet(content)
  })

  tweet(options).then(response => {
    handleSuccess(callback, 'Ok');
  }).catch(error => handleError(callback, error));

}

exports.handler = handler;