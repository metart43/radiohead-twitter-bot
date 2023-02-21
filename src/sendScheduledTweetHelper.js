require("dotenv").config();
const handler = require("./handler");
const { radioheadSpotifyId, thomYorkeSpotifyId, theSmileSpotifyId, atomsForPeaceSpotifyId } = require("./constants");

const args = process.argv.slice(2)
const artist = args[0];
const tweetId = args[1] || null;

const sendScheduleTweet = () => {
  let paramsToSend;

  const thomYorkeParams = {
    artist: "thom yorke",
    copyright: "@thomyorke",
    artistSpotifyId: thomYorkeSpotifyId,
    tweetId,
  };
  const theSmileParams = {
    copyright: "@thesmiletheband",
    artistSpotifyId: theSmileSpotifyId,
    tweetId,
  };
  const radioheadParams = {
    artistSpotifyId: radioheadSpotifyId,
    copyright: "@Radiohead",
    tweetId,
  };

  const atomsForPeaceParams = {
    artistSpotifyId: atomsForPeaceSpotifyId,
    copyright: "atoms for peace",
    tweetId,
  }

  if (artist === "thom") {
    paramsToSend = thomYorkeParams;
  }
  else if (artist === "smile") {
    paramsToSend = theSmileParams;
  }
  else if (artist === "radiohead") {
    paramsToSend = radioheadParams;
  }
  else if (artist === "atoms") {
    paramsToSend = atomsForPeaceParams;
  }
  else paramsToSend = radioheadParams;

  handler.bot(paramsToSend);
};

sendScheduleTweet();
