const client = require("./client");

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

const handleLongTweets = async ({ tweetText, tweetId, copyright }) => {
  const middleOfLyrics = tweetText.length / 2
  const indexOfFirstSpaceInTheMiddle = tweetText.indexOf(" ", middleOfLyrics)
  const firstHalf = tweetText.substring(0, indexOfFirstSpaceInTheMiddle)
  const secondHalf = tweetText.substring(indexOfFirstSpaceInTheMiddle)

  try {
    const { text: firstTweet, id } = await client.post("statuses/update", { status: firstHalf, in_reply_to_status_id: tweetId, auto_populate_reply_metadata: true });
    console.log("tweet.js#handleLongTweets#first half", firstTweet);
    const { text: secondTweet, id: id2 } = await client.post("statuses/update", { status: secondHalf, in_reply_to_status_id: id, auto_populate_reply_metadata: true });
    console.log("tweet.js#handleLongTweets#second half", secondTweet);
    const { text } = await client.post("statuses/update", { status: copyright, in_reply_to_status_id: id2, auto_populate_reply_metadata: true });
    console.log("tweet.js#handleLongTweets#copyright", text);
  } catch (error) {
    console.error("tweet.js#handleLongTweets#error", error);
  }

}

const tweet = async (lyrics, number, copyright, tweetId) => {
  let tweetText = combineLyrics(lyrics, number);
  let status;
  if (tweetText.length > 280) {
    handleLongTweets({ tweetText, tweetId, copyright });
  } else if (tweetText.length + copyright.length < 280) {
    tweetText += copyright;
  } else if (tweetText.length + copyright.length > 280) {
    try {
      console.log("if copyright doesn't fit with tweet text");
      const { id } = await client.post("statuses/update", { status: tweetText, in_reply_to_status_id: tweetId, auto_populate_reply_metadata: true });
      const { text } = await client.post("statuses/update", { status: copyright, in_reply_to_status_id: id, auto_populate_reply_metadata: true });
      console.log("tweet.js#tweet#id", text);
    } catch (error) {
      console.error("if copyright doesn't fit with tweet text", error);
    }
  }

  try {
    const replyOptions = {
      status: tweetText,
      auto_populate_reply_metadata: true,
    };
    if (tweetId) {
      replyOptions.in_reply_to_status_id = tweetId;
    }

    const { text } = await client.post("statuses/update", replyOptions);
    status = "success";
    console.log("tweet.js tweeted text:", text);
  } catch (e) {
    console.error("tweet.js#tweet#error tweeting", e);
    status = e;
  } finally {
    console.log("tweet.js status => ", status);
  }
};

module.exports = tweet;
