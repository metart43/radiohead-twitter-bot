const getDiscography = require("get-artist-discography/getDiscography");
const scrapeLyrics = require("./scrapeLyrics");
const { getXataClient } = require("./xata");
const xata = getXataClient();
const { removeRemastered } = require("./utils/misc");
const { smileSpotityId } = require("./constants")

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
      const spotifyArtistId = smileSpotityId;
      const limit = 38;
      const discography = await getDiscography(spotifyArtistId, limit);
      const xataArtist = await xata.db.artists.filter({spotifyId: spotifyArtistId}).getFirst()
      console.log({ discography })
      console.log({ xataArtist })
      for (const album of discography) {
        const { songs, release_date, spotifyId } = Object.values(album)[0];
        const albumName = Object.keys(album)[0];
        console.log("Checking if album exists", albumName);
    
        // Query to check if the album already exists
        const existingAlbum = await xata.db.albums.filter({ name: albumName, spotifyId: spotifyId }).getFirst();
    
        let createdAlbum;
        if (!existingAlbum) {
          console.log("Album does not exist, creating new album:", albumName);
          createdAlbum = await xata.db.albums.create({
            releaseDate: release_date,
            spotifyId: spotifyId,
            name: albumName,
            artist: { id: xataArtist.id },
          });
        } else {
          console.log("Album already exists, using existing album:", albumName);
          createdAlbum = existingAlbum;
        }
    
        for (const song of songs) {
          const sanitizedSongName = removeRemastered(song);
          console.log("Checking if song exists", sanitizedSongName);
    
          // Query to check if the song already exists
          const existingSong = await xata.db.songs.filter({ name: sanitizedSongName, album: createdAlbum.id }).getFirst();
    
          if (existingSong) {
            console.log("Song already exists, skipping creation:", sanitizedSongName);
            continue; // Skip to the next song
          }
    
          // If the song doesn't exist, scrape lyrics and create the song
          console.log("Preparing to scrape song | waiting for 15 seconds", sanitizedSongName);
          await new Promise((resolve) => setTimeout(resolve, 15000));
          const lyrics = await scrapeLyrics({ artist: xataArtist.name, song: sanitizedSongName });
    
          if (lyrics && lyrics.length) {
            const createdSong = await xata.db.songs.create({
              name: sanitizedSongName,
              album: createdAlbum.id,
              lyrics,
              artist: { id: xataArtist.id },
            });
            console.log("createdSong", createdSong);
          } else {
            console.log("no lyrics found for", song);
            await xata.db.songs.create({
              name: song,
              album: createdAlbum.id,
              artist: { id: xataArtist.id },
            });
          }
        }
      }
    };
    
    
    

connectLyricsWithDiscography();
module.exports = connectLyricsWithDiscography;
