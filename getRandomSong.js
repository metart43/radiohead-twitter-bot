const getRandomInt = (max) => {
  const number = Math.floor(Math.random() * max);
  return number === 23 || number === 20 || number === 8 || number === 2
    ? getRandomInt(max)
    : number;
};
const getRandomSong = (discography) => {
  const albumNumber = getRandomInt(discography.length);
  const albumName = Object.keys(discography[albumNumber])[0];
  const album = discography[albumNumber][albumName];
  const songsLength = album["songs"].length;
  const song = album["songs"][getRandomInt(songsLength)];
  const date = album["release_date"] || "";
  if (song.includes("-")) {
    return {
      url: song
        .toLowerCase()
        .split("-")[0]
        .replace(/[^A-Z0-9]+/gi, ""),
      song,
      date,
      albumName: albumName.replace(/ /g, ""),
    };
  } else {
    return {
      url: song.toLowerCase().replace(/[^A-Z0-9]+/gi, ""),
      song,
      date,
      albumName: albumName.replace(/ /g, ""),
    };
  }
};

module.exports = getRandomSong;
