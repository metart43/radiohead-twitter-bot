const client = require("./client");
const handler = require("./handler");

const parameters = {
  track: "#radioheadbot,@bot4radiohead,#bot4radiohead,#thomyorke,#radiohead",
};

const findThom = (context) => {
  for (word of context) {
    for (element of ["thom", "yorke"]) {
      if (word === element) return true;
    }
  }
};

module.exports.stream = async () =>
  client
    .stream("statuses/filter", parameters)
    .on("start", (response) => {
      console.log("start");
    })
    .on("data", ({ text, user, id_str }) => {
      console.log(
        "origin tweet text:",
        text,
        "\n",
        "origin userName:",
        user.name,
        "\n",
        "origin decription:",
        user.description,
        id_str
      );
      const thomYorkeParams = {
        limit: 20,
        artist: "thomyorke",
        copyright: "\n\n \u00A9 @thomyorke",
        artistId: "4CvTDPKA6W06DRfBnZKrau",
        tweetId: id_str,
      };
      const radioheadParams = {
        artist: "radiohead",
        artistId: "4Z8W4fKeB5YxbusRsdQVPb",
        limit: 38,
        copyright: "\n\n \u00A9 @Radiohead",
        tweetId: id_str,
      };
      const tweetContextArray = text.split(" ");

      findThom(tweetContextArray)
        ? handler.bot(_, _, _, thomYorkeParams)
        : handler.bot(_, _, _, radioheadParams);
    })
    .on("error", (error) => console.log("error", error))
    .on("end", (response) => console.log("end"));
