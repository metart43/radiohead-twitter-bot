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

module.exports.bot = async (params) => {
  console.log('handler.js => step 1', { params })
  let { copyright, artistId, limit, artist, tweetId } = params
  let lyrics, songInfo
  tryLimit = 0
  const discography = await getDiscography(artistId, limit)
  console.log('handler.js => step 2', { discography })
  do {
    const { song, date, albumName } = getRandomSong(discography)
    lyrics = await scrapeLyrics({ artist, song })
    songInfo = ` - ${song} \n${date} #${albumName}`
    tryLimit += 1
    console.log('tryLimit', tryLimit)
  } while (!lyrics && tryLimit <= 10)
  copyright += songInfo
  const numberOfParagraphs = countParagraphs(lyrics)
  console.log('handler.js => step 3', { numberOfParagraphs })
  await tweet(lyrics, numberOfParagraphs, copyright, tweetId)
  return { message: 'success' }
}
