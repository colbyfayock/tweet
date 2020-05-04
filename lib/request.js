const ERROR_MISSING_APPSECRET = 'Missing appsecret';
const ERROR_MISSING_AUTH = 'Missing authorization';

/**
 * validateRequest
 * @description Validates the request to avoid any missing details
 */

function validateRequest({ env }, headers) {

  if ( !env.APP_SECRET ) throw new Error(ERROR_MISSING_APPSECRET);
  if ( !headers || !headers.authorization ) throw new Error(ERROR_MISSING_AUTH);

}

module.exports.validateRequest = validateRequest;


/**
 * parsePayloadContent
 * @description Take the request body, parse it, and validate content
 */

function parsePayloadContent(body) {

  let content;

  try {
    content = JSON.parse(body);
  } catch(e) {
    throw new Error(`Failed to parse tweet content; ${e}`);
  }

  return content;

}

module.exports.parsePayloadContent = parsePayloadContent;


/**
 * handleSuccess
 * @description Handles any logging and callback on success
 */

function handleSuccess(callback, message) {

  const success = {
    message: `${message}`,
  }

  console.log(success.message);

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(success)
  });

}

module.exports.handleSuccess = handleSuccess;


/**
 * handleError
 * @description Handles any logging and callback on error
 */

function handleError(callback, message) {

  const error = {
    error: `Error: ${message}`,
  }

  console.log(error.error);

  callback(null, {
    statusCode: 500,
    body: JSON.stringify(error)
  });

}

module.exports.handleError = handleError;