const getRandomSong = require("./getRandomSong");
const tweet = require("./tweet.js");
const getDiscography = require("get-artist-discography/getDiscography");
const scrapeLyrics = require("./scrapeLyrics");

const countParagraphs = (lyrics) => {
  const reducer = (accumulator, currentValue) =>
    currentValue === "" ? accumulator + 1 : accumulator + 0;
  const number = lyrics.reduce(reducer, 0);
  return number;
};

module.exports.bot = async (
  event,
  context,
  callback,
  artist = "radiohead",
  artistID = "4Z8W4fKeB5YxbusRsdQVPb",
  limit = 38,
  copyright = "\n\n \u00A9 @Radiohead",
  tweetId = null
) => {
  let lyrics, songInfo;
  tryLimit = 0;
  const discography = await getDiscography(artistID, limit);
  // console.log(discography);
  do {
    const { url, song, date, albumName } = getRandomSong(discography);
    lyrics = await scrapeLyrics(artist, url);
    songInfo = ` - ${song} \n${date} #${albumName}`;
    tryLimit += 1;
    console.log("tryLimit", tryLimit);
  } while (!lyrics && tryLimit <= 10);
  copyright += songInfo;
  const numberOfParagraphs = countParagraphs(lyrics);
  await tweet(lyrics, numberOfParagraphs, copyright, tweetId);
  return { message: "success" };
};
