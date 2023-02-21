require("dotenv").config();
const client = require("./client");
const handler = require("./handler");
const { radioheadTwitterId, thomYorkeTwitterId, smileIdTwitterId } = require("./constants");
const { getXataClient } = require("./xata");
const xata = getXataClient();

const parameters = {
  track: "#radioheadbot, @r_adiohead_b, #r_adiohead_b, #Radioheadbot",
  // follow: "1009479715999092741, 10509537, 108382988",
};

const likeParams = {
  track:
    "#radiohead, #thomyorke, #thesmileband, #thom_yorke, radiohead, thom yorke, thesmileband, thom_yorke, thomyorke, atoms for peace",
  follow: `${smileIdTwitterId}, ${radioheadTwitterId}, ${thomYorkeTwitterId}`,
};

const startStream = (params, callback) => {
  const stream = client.stream("statuses/filter", params);
  stream.on("start", () => console.log("stream started"));
  stream.on("data", callback);
  stream.on("error", (error) => {
    console.log("error", error);
    setTimeout(() => startStream(params, callback), 1200000);
  });
  stream.on("end", (response) => {
    console.log("end", response);
    setTimeout(() => startStream(params, callback), 1200000);
  });
  return stream;
};

module.exports.like = () =>
  startStream(likeParams, ({ text, user, id_str, retweeted, is_quote_status }) => {
    let counter = 0;
    console.log(
      "tweet text:",
      text,
      "\n",
      "@",
      user && user.name,
      "\n",
      "userId:",
      user && user.id_str,
      "\n",
      "bio:",
      user && user.description,
      "\n",
      "tweet_id:",
      id_str
    );
    if (retweeted || is_quote_status || text.startsWith("RT")) {
      return;
    } else {
      if (counter % 2 === 0) {
        handler.likeTweet({ id: id_str });
      }
      counter++;
    }
  });

module.exports.reply = async () => {
  const artists = await xata.db.artists.getAll();
  startStream(parameters, ({ text, user, id_str, retweeted, is_quote_status }) => {
    console.log(
      "tweet text:",
      text,
      "\n",
      "@:",
      user.name,
      "\n",
      "userId:",
      user.id_str,
      "\n",
      "bio:",
      user.description,
      "\n",
      "tweet_id:",
      id_str
    );
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    console.log({ randomArtist });
    const { copyright, spotifyId: artistSpotifyId } = randomArtist;
    if (retweeted || is_quote_status || text.startsWith("RT")) {
      return;
    } else {
      handler.bot({ copyright, artistSpotifyId, tweetId: id_str });
    }
  });
};
