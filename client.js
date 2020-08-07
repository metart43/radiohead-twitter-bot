const Twitter = require("twitter-lite");

const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY, // from Twitter.
  consumer_secret: process.env.TWITTER_API_SECRET, // from Twitter.
  access_token_key: process.env.ACCESS_TOKEN, // from your User (oauth_token)
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

module.exports = client;
