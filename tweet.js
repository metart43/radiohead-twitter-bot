const client = require("./client");
const handler = require("./handler");

const combineLyrics = (lyrics, number) => {
  if (number === 0) {
    //if no paragrapns return random sentence
    return lyrics[Math.floor(Math.random() * lyrics.length)];
  }
  //create a new arraw with number of paragraphs in lyrics
  const tweetArray = new Array(number);
  for (let i = 0; i < tweetArray.length; i++) {
    tweetArray[i] = new Array();
  }
  const reducer = (accumulator, currentValue) => {
    //combine lyrics by separating paragraphs into separate arrays
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
  let response;
  if (status.length > 280) {
    handler.bot();
  } else if (status.length + copyright.length < 280) {
    status += copyright;
  }
  try {
    const { text } = await client.post("statuses/update", {
      status,
      in_reply_to_status_id: tweetId,
      auto_populate_reply_metadata: true,
    });
    response = "Success";
    console.log("text:", text);
  } catch (e) {
    response = e;
  } finally {
    console.log(response);
  }
};

module.exports = tweet;
