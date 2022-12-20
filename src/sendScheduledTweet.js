const handler = require("./handler");

const args = process.argv.slice(2)
const artist = args[0];
const tweetId = args[1] || null;

const sendScheduleTweet = () => {
  let paramsToSend;
  const thomYorkeParams = {
    limit: 20,
    artist: "thom yorke",
    copyright: "\n\n \u00A9 @thomyorke",
    artistId: "4CvTDPKA6W06DRfBnZKrau",
    tweetId,
  };
  const theSmileParams = {
    limit: 20,
    artist: "the smile",
    copyright: "\n\n \u00A9 @thesmiletheband",
    artistId: "6styCzc1Ej4NxISL0LiigM",
    tweetId,
  };
  const radioheadParams = {
    artist: "radiohead",
    artistId: "4Z8W4fKeB5YxbusRsdQVPb",
    limit: 38,
    copyright: "\n\n \u00A9 @Radiohead",
    tweetId,
  }; 

  const atomsForPeaceParams = {
    artist: "atoms for peace",
    artistId: "7tA9Eeeb68kkiG9Nrvuzmi",
    limit: 12,
    copyright: "\n\n \u00A9 atoms for peace",
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
