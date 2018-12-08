require('dotenv').config();

const jwt = require('jsonwebtoken');
const axios = require('axios');
const Twitter = require('twitter');

let client;

const ERROR_MISSING_AUTH = 'Missing authorization';
const ERROR_MISSING_STATUS = 'Missing status';

exports.handler = function(event = {}, context, callback) {

  if ( !event.headers || !event.headers.authorization ) {

    console.log(ERROR_MISSING_AUTH);

    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: ERROR_MISSING_AUTH,
      })
    });

  }

  const auth = jwt.verify(event.headers.authorization, process.env.APP_SECRET);

  client = new Twitter({
    consumer_key: auth.twitter_consumer_key,
    consumer_secret: auth.twitter_consumer_secret,
    access_token_key: auth.twitter_access_token_key,
    access_token_secret: auth.twitter_access_token_secret,
  });

  tweet(event).then(response => {

    console.log('response', response);

    callback(null, {
      statusCode: 200,
      body: 'Ok'
    });

  }).catch(error => {

    const error_message = `Error: ${error}`;

    console.log(error_message);

    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: error_message,
      })
    });

  });

}


/**
 * tweet
 * @description
 */

async function tweet({ body, headers }) {

  let content;
  let media;
  let options;
  let request;

  try {
    content = JSON.parse(body);
  } catch(e) {
    throw new Error(`Failed to parse tweet content; ${e}`);
  }

  if ( typeof content.link !== 'string' || content.link.length === 0 ) {
    throw new Error('Missing link in tweet content');
  }

  if ( typeof content.image === 'string' && content.image.length !== 0 ) {
    media = await uploadMedia(content.image);
  }

  options = {
    status: `${content.description} #givemecheapstuff #deals ${content.link}`,
  };

  if ( media ) {
    options.media_ids = media.media_id_string;
  }

  request = await post(options);

  return request;

}


/**
 * uploadMedia
 * @description
 */

async function uploadMedia(media) {

  const media_request = await axios.get(media, {
    responseType: 'arraybuffer'
  });

  if ( media_request.status !== 200 || !media_request.data ) {
    throw new Error('Failed to download media');
  }

  const media_base64 = new Buffer(media_request.data, 'binary').toString('base64');

  const options = {
    media_data: media_base64,
  };

  return new Promise((resolve, reject) => {
    client.post('media/upload', options,  (error, media, response) => {

      if ( error ) {
        reject(`Failed to upload media; ${error}`);
        return;
      }

      resolve(media);

    });
  });

}


/**
 * post
 * @description
 */

function post(options = {}) {

  return new Promise((resolve, reject) => {

    if ( typeof options.status !== 'string' ) {
      reject(ERROR_MISSING_STATUS);
    }

    client.post('statuses/update', options,  (error, tweet, response) => {

      if ( error ) {
        reject(error);
        return;
      }

      resolve(response);

    });

  });

}