require("dotenv").config();
const handler = require("./handler");

const args = process.argv.slice(2)
const artist = args[0];
const tweetId = args[1] || null;

const sendScheduleTweet = () => {
  let paramsToSend;

  const thomYorkeParams = {
    artist: "thom yorke",
    copyright: "@thomyorke",
    artistSpotifyId: "4CvTDPKA6W06DRfBnZKrau",
    tweetId,
  };
  const theSmileParams = {
    copyright: "@thesmiletheband",
    artistSpotifyId: "6styCzc1Ej4NxISL0LiigM",
    tweetId,
  };
  const radioheadParams = {
    artistSpotifyId: "4Z8W4fKeB5YxbusRsdQVPb",
    copyright: "@Radiohead",
    tweetId,
  };

  const atomsForPeaceParams = {
    artistSpotifyId: "7tA9Eeeb68kkiG9Nrvuzmi",
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
