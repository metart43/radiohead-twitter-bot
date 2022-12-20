const getRandomInt = (max) => {
  const number = Math.floor(Math.random() * max);
  return number;
};
const getRandomSong = (discography) => {
  const albumNumber = getRandomInt(discography.length);
  const albumName = Object.keys(discography[albumNumber])[0];
  const album = discography[albumNumber][albumName];
  const songsLength = album["songs"].length;
  const song = album["songs"][getRandomInt(songsLength)];
  const date = album["release_date"] || "";

  return {
    song,
    date,
    albumName: albumName.replace(/ /g, ""),
  };
};

module.exports = getRandomSong;
