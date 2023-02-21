require("dotenv").config();
const { getXataClient } = require("./xata");
const xata = getXataClient();

const updateRecords = async () => {
  // Generated with CLI
  const albums = await xata.db.albums.filter({ artist: { spotifyId: "" } }).getAll()
  console.log("albums", albums.length)
}

updateRecords()
module.exports = updateRecords;