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

module.exports.like = async () =>
  client
    .stream("statuses/filter", likeParams)
    .on("start", () => console.log("stream started"))
    .on("data", ({ text, user, id_str, retweeted, is_quote_status }) => {
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
        handler.likeTweet({ id: id_str });
      }
    });

module.exports.stream = async () => {
  const records = await xata.db.artists.getAll();
  const artists = records.map(({ name, spotifyId }) => ({ name, spotifyId }));
  const randomArtist = artists[Math.floor(Math.random() * artists.length)];
  const { copyright, spotifyId: artistSpotifyId } = randomArtist;
  client
    .stream("statuses/filter", parameters)
    .on("start", () => console.log("stream started"))
    .on("data", ({ text, user, id_str, retweeted, is_quote_status }) => {
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
      if (retweeted || is_quote_status || text.startsWith("RT")) {
        return;
      } else {
        handler.bot({ copyright, artistSpotifyId, tweetId: id_str });
      }
    })
    .on("error", (error) => console.log("error", error))
    .on("end", (response) => console.log("end", response))
}
