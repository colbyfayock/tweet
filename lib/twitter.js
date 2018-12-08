const axios = require('axios');
const Twitter = require('twitter');

const ERROR_MISSING_STATUS = 'Missing status';
const ERROR_MISSING_PRODUCT_LINK = 'Missing link in tweet content';
const ERROR_DOWNLOADING_MEDIA = 'Failed to download media';
const ERROR_UPLOADING_MEDIA = 'Failed to upload media';

let client;


/**
 * tweet
 * @description Manage setting up and tweeting the given status
 */

async function tweet({ config, status, media }) {

  if ( !client ) {
    client = new Twitter({
      consumer_key: config.twitter_consumer_key,
      consumer_secret: config.twitter_consumer_secret,
      access_token_key: config.twitter_access_token_key,
      access_token_secret: config.twitter_access_token_secret,
    });
  }

  const options = {
    status,
  }

  let uploaded_media;
  let request;

  if ( typeof media === 'string' && media.length !== 0 ) {
    uploaded_media = await uploadMedia(media);
  }

  if ( uploaded_media ) {
    options.media_ids = uploaded_media.media_id_string;
  }

  request = await post(client, options);

}

module.exports.tweet = tweet;


/**
 * buildTweet
 * @description Given the content, build a tweet options object
 */

function buildTweet({ description, link, image }) {

  if ( typeof link !== 'string' || link.length === 0 ) {
    throw new Error(ERROR_MISSING_PRODUCT_LINK);
  }

  return {
    status: `${content.description} #givemecheapstuff #deals ${content.link}`,
    media: image,
  };

}

module.exports.buildTweet = buildTweet;


/***********
 * PRIVATE *
 ***********/

/**
 * uploadMedia
 * @description Upload given media to Twitter and return as base64
 */

async function uploadMedia(media) {

  const media_request = await axios.get(media, {
    responseType: 'arraybuffer'
  });

  if ( media_request.status !== 200 || !media_request.data ) {
    throw new Error(ERROR_DOWNLOADING_MEDIA);
  }

  const media_base64 = new Buffer(media_request.data, 'binary').toString('base64');

  const options = {
    media_data: media_base64,
  };

  return new Promise((resolve, reject) => {
    client.post('media/upload', options,  (error, media, response) => {

      if ( error ) {
        reject(`${ERROR_UPLOADING_MEDIA}; ${error}`);
        return;
      }

      resolve(media);

    });
  });

}


/**
 * post
 * @description Posts the given status update to twitter
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