const getDiscography = require("get-artist-discography/getDiscography");
const scrapeLyrics = require("./scrapeLyrics");

const discographyArray = [];

const connectLyricsWithDiscography = async () => {
  //1. Fetch Discography from Spotify
  //2. Loop through Discography
  //3. Scrape Lyrics
  //4. Save Lyrics to DB
  //5. Tweet Lyrics

  const radioheadArtistId = "4Z8W4fKeB5YxbusRsdQVPb";
  const limit = 38;
  const discography = await getDiscography(radioheadArtistId, limit);

  for (album of discography) {
    const { songs, release_date, images, spotifyId } = Object.values(album)[0];
    const albumName = Object.keys(album)[0];
    console.log(" album.songs", songs);
    console.log(Object.keys(album)[0]);
    const albumObject = {
      name: albumName,
      releaseDate: release_date,
      images: images,
      spotifyId: spotifyId,
      songs: [],
    };
    for (const song of songs) {
      const lyrics = await scrapeLyrics({ artist: "Radiohead", song });
      if (lyrics && lyrics.length) {
        albumObject.songs.push({
          name: song,
          lyrics,
        });
      }
    }
    discographyArray.push(albumObject);
  }
  console.log("discographyArray", discographyArray[0]);
};

connectLyricsWithDiscography();
module.exports = connectLyricsWithDiscography;
