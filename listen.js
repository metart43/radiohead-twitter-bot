const client = require("./client");
const handler = require("./handler");

const parameters = {
  track: "#radioheadbot,@bot4radiohead,#bot4radiohead",
  follow: "110509537,108382988,2192998782", // @OrchardAI, @tylerbuchea
};

module.exports.stream = async () =>
  client
    .stream("statuses/filter", parameters)
    .on("start", (response) => {
      console.log("start");
    })
    .on("data", ({ id_str, text, user }) => {
      console.log(
        "text:",
        text,
        "\n",
        "userName:",
        user.name,
        "\n",
        "decription:",
        user.description
      );
      const limit = 20;
      const artist = "thomyorke";
      const copyright = "\n\n \u00A9 @thomyorke";
      const thomYorkeID = "4CvTDPKA6W06DRfBnZKrau";
      text.includes("@thomyorke")
        ? handler.bot(_, _, _, artist, thomYorkeID, limit, copyright, id_str)
        : handler.bot();
    })
    .on("error", (error) => console.log("error", error))
    .on("end", (response) => console.log("end"));
