require("dotenv").config();
const handler = require("./handler");
const { getXataClient } = require("./xata");
const xata = getXataClient();

const sendTweet = async () => {
  const artists = await xata.db.artists.getAll();
  const randomArtist = artists[Math.floor(Math.random() * artists.length)];
  console.log("src/sendTweet30.js", { randomArtist })
  const { copyright, spotifyId: artistSpotifyId } = randomArtist;

  handler.bot({ copyright, artistSpotifyId });
};

// Run sendScheduleTweet every 30 minutes
const interval = 30 * 60 * 10; // 30 minutes in milliseconds
setInterval(sendTweet, interval);