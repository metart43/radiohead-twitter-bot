const handler = require("./handler");

const args = process.argv.slice(2)
const artist = args[0];

const sendScheduleTweet = () => {
  let paramsToSend;
  const thomYorkeParams = {
    limit: 20,
    artist: "thom yorke",
    copyright: "\n\n \u00A9 @thomyorke",
    artistId: "4CvTDPKA6W06DRfBnZKrau",
    tweetId: null,
  };
  const theSmileParams = {
    limit: 20,
    artist: "the smile",
    copyright: "\n\n \u00A9 @thesmiletheband",
    artistId: "6styCzc1Ej4NxISL0LiigM",
    tweetId: null,
  };
  const radioheadParams = {
    artist: "radiohead",
    artistId: "4Z8W4fKeB5YxbusRsdQVPb",
    limit: 38,
    copyright: "\n\n \u00A9 @Radiohead",
    tweetId: null,
  };

  if (artist === "thom") {
    paramsToSend = thomYorkeParams;
  }
  else if (artist === "smile") {
    paramsToSend = theSmileParams;
  }
  else if (artist === "radiohead") {
    paramsToSend = radioheadParams;
  }
  else paramsToSend = radioheadParams;

  handler.bot(paramsToSend);
};

sendScheduleTweet();
