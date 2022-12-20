require("dotenv").config();
const getRandomSong = require("./utils/getRandomSong");
const tweet = require("./tweet.js");
const client = require("./client");
const { countParagraphs } = require("./utils/misc");

module.exports.bot = async ({ copyright, artistSpotifyId, tweetId }) => {
  const { song, date, lyrics, albumName } = await getRandomSong({ artistSpotifyId });
  const songInfo = ` - ${song} \n${date} #${albumName}`;
  copyright += songInfo;
  if (lyrics && lyrics.length > 0) {
    const numberOfParagraphs = countParagraphs(lyrics);
    await tweet(lyrics, numberOfParagraphs, copyright, tweetId);
    console.log({ message: "success" });
  } else {
    // recursively call this function until i get lyrics
    console.log("no lyrics, trying again");
    await module.exports.bot({ copyright, artistSpotifyId, tweetId });
  }
};

module.exports.likeTweet = async (params) => {
  const { id } = params;
  try {
    await client.post("favorites/create", { id });
    console.log("handler.js liked tweet");
  } catch (e) {
    console.log("handler.js#likeTweet#error liking tweet", e);
  }
};
