const removeRemastered = (title) => {
  return title.replace(" - Remastered", "");
}

const getRandomInt = (max) => {
  const number = Math.floor(Math.random() * max);
  return number;
};

const countParagraphs = (lyrics) => {
  const reducer = (accumulator, currentValue) =>
    currentValue === "" ? accumulator + 1 : accumulator + 0;
  const number = lyrics.reduce(reducer, 0);
  return number;
};

module.exports = {
  removeRemastered,
  getRandomInt,
  countParagraphs
};