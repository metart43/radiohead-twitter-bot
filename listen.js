const client = require("./client");
const handler = require("./handler");

const parameters = {
  track: "#radioheadbot",
  follow: "1129880023161278465", // @OrchardAI, @tylerbuchea
};

module.exports.stream = async () =>
  client
    .stream("statuses/filter", parameters)
    .on("start", (response) => {
      console.log("start");
    })
    .on("data", (tweet) => {
      console.log("data", tweet);
      const limit = 20;
      const artist = "thomyorke";
      const copyright = "\n\n \u00A9 @thomyorke";
      const thomYorkeID = "4CvTDPKA6W06DRfBnZKrau";
      handler.bot(_, _, _, artist, thomYorkeID, limit, copyright, tweet.id);
    })
    .on("error", (error) => console.log("error", error))
    .on("end", (response) => console.log("end"));
