# 🐦 Tweet with Twitter!

Lambda for simply sending a tweet upon post using Netlify's Functions capabilities.

## ⚡ Quick Start

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/colbyfayock/tweet)

* Deploy to Netlify (use button above)
* Add a unique key as your APP_SECRET under Settings > Build & Deploy > Environment
* Once deployed, you're ready to get started!

Your function should now be avialable at:

```
https://[your-netlify-site].netlify.com/.netlify/functions/tweet
```

## 🚀 Posting to Endpoint

### Authorization Header
When posting to the endpoint, you'll need to generate a [JWT](https://jwt.io/) given the same `APP_SECRET` as above. The contents of the JWT before signed should look like:
```
{
  twitter_consumer_key: [key],
  twitter_consumer_secret: [key],
  twitter_access_token_key: [key],
  twitter_access_token_secret: [key],
}
```

You can use libraries such as Auth0's JsonWebToken to generate within your app: https://github.com/auth0/node-jsonwebtoken

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

## ⚒️ Local Setup

### Install Dependencies

To begin setup, with a newly cloned repo:

```
yarn install
```

### Env
Create a local `.env` file at the root of the project with the shared secret. This is used in coordination with JWT to create token containing your Twitter keys that gets posted to this function endpoint.

```
APP_SECRET="[secret]"
```

### Run it Locally

To test this locally, run:

```
yarn serve
```

The function should now be available at `localhost:9000/tweet`

