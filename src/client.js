require("dotenv").config();
const { TwitterApi } = require('twitter-api-v2');

const { 
  TWITTER_API_KEY,
  TWITTER_API_SECRET, 
  TWITTER_ACCESS_TOKEN, 
  TWITTER_ACCESS_TOKEN_SECRET 
} = process.env

const consumerKey = TWITTER_API_KEY;
const consumerSecret = TWITTER_API_SECRET;
const accessToken = TWITTER_ACCESS_TOKEN;
const tokenSecret = TWITTER_ACCESS_TOKEN_SECRET;

const client = new TwitterApi({
    appKey: consumerKey,
    appSecret: consumerSecret,
    accessToken: accessToken,
    accessSecret: tokenSecret,
});

module.exports = client.readWrite;
