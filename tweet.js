const client = require("./client");
const handler = require("./handler");

const combineLyrics = (lyrics, number) => {
  if (number === 0) {
    return lyrics[0];
  }
  const tweetArray = new Array(number);
  for (let i = 0; i <= tweetArray.length; i++) {
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
  const paragraph = Math.floor(Math.random() * tweetArray.length);
  const status = tweetArray[paragraph].join("\n");
  return status;
};

const tweet = async (lyrics, number, copyright, tweetId) => {
  let status = combineLyrics(lyrics, number);
  console.log(tweetId);

  if (status.length > 280) {
    handler.bot();
  } else if (status.length + copyright.length < 280) {
    status += copyright;
  }

  await client.post("statuses/update", {
    status,
    in_reply_to_status_id: tweetId,
  });
};

module.exports = tweet;
