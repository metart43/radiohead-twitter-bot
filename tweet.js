const Twitter = require("twitter-lite");
const dotenv = require("dotenv");

dotenv.config();

const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY, // from Twitter.
  consumer_secret: process.env.TWITTER_API_SECRET, // from Twitter.
  access_token_key: process.env.ACCESS_TOKEN, // from your User (oauth_token)
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const combineLyrics = (lyrics, number) => {
  const tweetArray = new Array(number);
  for (let i = 0; i < tweetArray.length; i++) {
    tweetArray[i] = new Array();
  }
  const reducer = (accumulator, currentValue) => {
    if (currentValue === "") {
      return accumulator + 1;
    } else {
      if (tweetArray[accumulator]) {
        tweetArray[accumulator].push(currentValue);
      }
      return accumulator + 0;
    }
  };
  lyrics.reduce(reducer, 0);
  const paragraph = Math.floor(Math.random() * Math.floor(tweetArray.length));
  const status = tweetArray[paragraph].join("\n");
  return status;
};

const tweet = async (lyrics, number) => {
  const status = combineLyrics(lyrics, number);
  console.log(status);
  await client.post("statuses/update", {
    status,
  });
};

module.exports = tweet;
