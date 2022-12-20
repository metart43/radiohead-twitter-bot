const getDiscography = require("get-artist-discography/getDiscography");
const scrapeLyrics = require("./scrapeLyrics");
const { getXataClient } = require("./xata");
const xata = getXataClient();

const connectLyricsWithDiscography = async () => {
  //1. Fetch Discography from Spotify
  //2. Loop through Discography
  //3. Scrape Lyrics
  //4. Save Lyrics to DB
  //5. Tweet Lyrics

  const radioheadArtistId = "4Z8W4fKeB5YxbusRsdQVPb";
  const limit = 38;
  const discography = await getDiscography(radioheadArtistId, limit);

  for (const album of discography) {
    const { songs, release_date, spotifyId } = Object.values(album)[0];
    const albumName = Object.keys(album)[0];
    console.log("Preparing for albumName", albumName);
    console.log("Preparing to loop throught album songs=", songs);
    const createdAlbum = await xata.db.albums.create({
      releaseDate: release_date,
      spotifyId: spotifyId,
      name: albumName,
    });
    console.log("album created", createdAlbum);
    for (const song of songs) {
      // await for 30 minute before scraping the next song
      console.log("Preparing to scrape song | waiting ofr 30 seconds", song)
      await new Promise((resolve) => setTimeout(resolve, 30000));
      const lyrics = await scrapeLyrics({ artist: "Radiohead", song });
      if (lyrics && lyrics.length) {
        const createdSong = await xata.db.songs.create({
          name: song,
          albumId: createdAlbum.id,
          lyrics,
        });
        console.log("createdSong", createdSong);
      } else {
        console.log("no lyrics found for", song);
        await xata.db.songs.create({
          name: song,
          albumId: createdAlbum.id,
        });
      }
    }
  }
};

connectLyricsWithDiscography();
module.exports = connectLyricsWithDiscography;
