const { getXataClient } = require("../xata");
const xata = getXataClient();

const getRandomSong = async ({ artistSpotifyId }) => {
  const songs = await xata.db.songs.filter({ artist: { spotifyId: artistSpotifyId } }).getAll();
  const randomSong = songs[Math.floor(Math.random() * songs.length)];
  const { name: song, lyrics, album } = randomSong;
  const relatedAlbum = await xata.db.albums.read(album.id);
  console.log({ relatedAlbum })
  return {
    song,
    lyrics,
    date: relatedAlbum.releaseDate,
    albumName: relatedAlbum.name.replace(/ /g, ""),
  };
};

module.exports = getRandomSong;
