# Tweet with Twitter!

Lambda for simply sending a tweet upon post using Netlify's Functions capabilities.

## Setup

To begin setup, with a newly cloned repo:
```
yarn install
```

To test this locally, run:
```
yarn serve
```
Which will start the function available at `localhost:9000/tweet`

### Config
There are a few requirements for getting this to work:
 - Generate a shared secret string
 - Twitter consumer key
 - Twitter consumer secret
 - Twitter access token
 - Twitter access secret

### Env
Create a local `.env` file with the shared secret. This is used in coordination with JWT to create token containing your Twitter keys that gets posted to this function endpoint.

```
APP_SECRET="[secret]"
```

Wherever this is getting deployed, you'll need to set up an environment variable with that name that will populate the `process.env` when the function is ran. With Netlify, you can set this up as a Build Environment Variable.

## Posting to Endpoint

### Authorization Header
When posting to the endpoint, you'll need to generate a JWT given the same `APP_SECRET` as above. The contents of the JWT before signed should look like:
```
{
  twitter_consumer_key: [key],
  twitter_consumer_secret: [key],
  twitter_access_token_key: [key],
  twitter_access_token_secret: [key],
}
```

Pass this as an `Authorization` header

### Content
The body of the post should look like the following:
```
{
  "description": "[text of tweet]",
  "link": "[tweet link appended to status]",
  "image": "[tweet image (optional)]",
}
```