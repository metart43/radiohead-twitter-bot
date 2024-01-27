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

const postTweet = async (text, replyId = null) => {
  const options = {
    ...(replyId && { in_reply_to_tweet_id: replyId })
  };

  try {
    const { data } = await client.v2.tweet(text, options);
    console.log(`Tweet posted: ${data.text}`);
    return data.id;
  } catch (error) {
    console.error('Error posting tweet:', error);
    throw error; // Rethrow to handle in calling function
  }
};

const handleLongTweets = async ({ tweetText, tweetId, copyright }) => {
  const middleOfLyrics = tweetText.length / 2;
  const indexOfFirstSpaceInTheMiddle = tweetText.indexOf(' ', middleOfLyrics);
  const firstHalf = tweetText.substring(0, indexOfFirstSpaceInTheMiddle);
  const secondHalf = tweetText.substring(indexOfFirstSpaceInTheMiddle);

  try {
    const firstTweetId = await postTweet(firstHalf, tweetId);
    const secondTweetId = await postTweet(secondHalf, firstTweetId);
    await postTweet(copyright, secondTweetId);
  } catch (error) {
    console.error('Error in handleLongTweets:', error);
  }
};

const tweet = async (lyrics, number, copyright, tweetId) => {
  let tweetText = combineLyrics(lyrics, number);
  let status = 'pending';

  try {
    if (tweetText.length > 280) {
      await handleLongTweets({ tweetText, tweetId, copyright });
    } else {
      const combinedText = tweetText + (tweetText.length + copyright.length <= 280 ? copyright : '');
      const replyId = tweetText.length + copyright.length > 280 ? await postTweet(tweetText, tweetId) : tweetId;
      await postTweet(combinedText, replyId);
    }
    status = 'success';
  } catch (error) {
    console.error('Error in tweet function:', error);
    status = 'error';
  } finally {
    console.log('Tweet process status:', status);
  }
};


module.exports = tweet;
