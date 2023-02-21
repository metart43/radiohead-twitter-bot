const getDiscography = require("get-artist-discography/getDiscography");
const scrapeLyrics = require("./scrapeLyrics");
const { getXataClient } = require("./xata");
const xata = getXataClient();
const { removeRemastered } = require("./utils/misc");

/**
  * This function connects lyrics with discography.
  * It retrieves the discography of an artist from the Spotify API, then loops through each album in the discography,
  * creates an album with its details, and loops through each song in the album. For each song, it waits for 30 seconds
  * before scraping the lyrics using the scrapeLyrics function. If lyrics are found, it creates a song with its
  * details, including the lyrics. If no lyrics are found, it creates a song without lyrics. The function logs the process
  * to the console as it runs.
    @returns {Promise<void>} - A Promise that resolves when the function is finished.
    */



const connectLyricsWithDiscography = async () => {
  const spotifyArtistId = ""
  const limit = 38;
  const discography = await getDiscography(spotifyArtistId, limit);

  for (const album of discography) {
    const { songs, release_date, spotifyId } = Object.values(album)[0];
    const albumName = Object.keys(album)[0];
    console.log("Preparing for album", albumName);
    console.log("Preparing to loop throught album songs", songs);
    const createdAlbum = await xata.db.albums.create({
      releaseDate: release_date,
      spotifyId: spotifyId,
      name: albumName,
      artist: { id: "" },
    });
    console.log("album created", createdAlbum);
    for (const song of songs) {
      const sanitizedSongName = removeRemastered(song);
      // await for 30 minute before scraping the next song
      console.log("Preparing to scrape song | waiting for 30 seconds", sanitizedSongName);
      await new Promise((resolve) => setTimeout(resolve, 30000));
      const lyrics = await scrapeLyrics({ artist: "atoms for peace", song: sanitizedSongName });
      if (lyrics && lyrics.length) {
        const createdSong = await xata.db.songs.create({
          name: sanitizedSongName,
          album: createdAlbum.id,
          lyrics,
          artist: { id: "" },
        });
        console.log("createdSong", createdSong);
      } else {
        console.log("no lyrics found for", song);
        await xata.db.songs.create({
          name: song,
          album: createdAlbum.id,
          artist: { id: "" },
        });
      }
    }
  }
};

connectLyricsWithDiscography();
module.exports = connectLyricsWithDiscography;
