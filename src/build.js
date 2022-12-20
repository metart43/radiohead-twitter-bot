const getDiscography = require("get-artist-discography/getDiscography");
const scrapeLyrics = require("./scrapeLyrics");
const { getXataClient } = require("./xata");
const xata = getXataClient();
const { removeRemastered } = require("./utils/misc");

const connectLyricsWithDiscography = async () => {
  const artistId = "7tA9Eeeb68kkiG9Nrvuzmi";
  const limit = 38;
  const discography = await getDiscography(artistId, limit);

  for (const album of discography) {
    const { songs, release_date, spotifyId } = Object.values(album)[0];
    if (spotifyId !== "6x4C6uMJqQnnp4V39p2CeO") {
      const albumName = Object.keys(album)[0];
      console.log("Preparing for albumName", albumName);
      console.log("Preparing to loop throught album songs=", songs);
      const createdAlbum = await xata.db.albums.create({
        releaseDate: release_date,
        spotifyId: spotifyId,
        name: albumName,
        artist: { id: "rec_ceguemd6k6j1ahqr413g" },
      });
      console.log("album created", createdAlbum);
      for (const song of songs) {
        const sanitizedSongName = removeRemastered(song);
        // await for 30 minute before scraping the next song
        console.log("Preparing to scrape song | waiting ofr 30 seconds", sanitizedSongName)
        await new Promise((resolve) => setTimeout(resolve, 30000));
        const lyrics = await scrapeLyrics({ artist: "atoms for peace", song: sanitizedSongName });
        if (lyrics && lyrics.length) {
          const createdSong = await xata.db.songs.create({
            name: sanitizedSongName,
            album: createdAlbum.id,
            lyrics,
            artist: { id: "rec_ceguemd6k6j1ahqr413g" },
          });
          console.log("createdSong", createdSong);
        } else {
          console.log("no lyrics found for", song);
          await xata.db.songs.create({
            name: song,
            album: createdAlbum.id,
            artist: { id: "rec_ceguemd6k6j1ahqr413g" },
          });
        }
      }
    }
  }
};

connectLyricsWithDiscography();
module.exports = connectLyricsWithDiscography;
