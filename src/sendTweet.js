require("dotenv").config();
const handler = require("./handler");
const { getXataClient } = require("./xata");
const xata = getXataClient();
const { radioheadSpotifyId } = require("./constants");

const sendTweet = async () => {
  const artists = await xata.db.artists.filter({ spotifyId: radioheadSpotifyId }).getAll();
  const randomArtist = artists[Math.floor(Math.random() * artists.length)];
  console.log("src/sendTweet.js", { randomArtist })
  const { copyright, spotifyId: artistSpotifyId } = randomArtist;

  handler.bot({ copyright, artistSpotifyId });
};

// Run sendScheduleTweet every 60 minute
const interval = 1000 * 60 * 60;
setInterval(sendTweet, interval);