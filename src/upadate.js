require("dotenv").config();
const { getXataClient } = require("./xata");
const xata = getXataClient();

const updateRecords = async () => {
  // Generated with CLI
  const albums = await xata.db.albums.filter({ artist: { spotifyId: "4Z8W4fKeB5YxbusRsdQVPb" } }).getAll()
  console.log("albums", albums.length)
}

updateRecords()
module.exports = updateRecords;