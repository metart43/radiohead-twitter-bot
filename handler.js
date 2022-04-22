const getRandomSong = require("./getRandomSong");
const tweet = require("./tweet.js");
const getDiscography = require("get-artist-discography/getDiscography");
const scrapeLyrics = require("./scrapeLyrics");
const client = require("./client");

const countParagraphs = (lyrics) => {
  const reducer = (accumulator, currentValue) =>
    currentValue === "" ? accumulator + 1 : accumulator + 0;
  const number = lyrics.reduce(reducer, 0);
  return number;
};

module.exports.bot = async (params) => {
  let { copyright, artistId, limit, artist, tweetId } = params;
  let lyrics, songInfo;
  tryLimit = 0;
  const discography = await getDiscography(artistId, limit);
  do {
    const { song, date, albumName } = getRandomSong(discography);
    lyrics = await scrapeLyrics({ artist, song });
    songInfo = ` - ${song} \n${date} #${albumName}`;
    tryLimit += 1;
    console.log("tryLimit", tryLimit);
  } while (!lyrics && tryLimit <= 10);
  copyright += songInfo;
  console.log("handler.js =>", { lyrics });
  if (lyrics && lyrics.length > 0) {
    const numberOfParagraphs = countParagraphs(lyrics);
    await tweet(lyrics, numberOfParagraphs, copyright, tweetId);
    console.log({ message: "success" });
  } else {
    console.log({ message: "couldn't generate lyrics" });
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
