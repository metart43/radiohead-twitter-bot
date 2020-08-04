const puppeteer = require("puppeteer");
const getRandomSong = require("./getRandomSong");
const tweet = require("./tweet.js");
const getDiscography = require("get-artist-discography/getDiscography");
const proxtList = require("./proxy-list.json");

const getBrowser = async () => {
  //helper function to launch browser. Function is beign reused to make sure browser is running.
  const proxy = proxtList[Math.floor(Math.random() * Math.floor(2004))];
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.IS_LOCAL
        ? undefined
        : "/var/task/headless_shell",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        `--proxy-server=${proxy}`,
        "--proxy-bypass-list=*",
      ],
    });
    return browser;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const countParagraphs = (lyrics) => {
  const reducer = (accumulator, currentValue) =>
    currentValue === "" ? accumulator + 1 : accumulator + 0;
  const number = lyrics.reduce(reducer, 0);
  return number;
};

const scrapeLyrics = async (song) => {
  try {
    const browser = await getBrowser();
    const url = new URL(
      `https://www.azlyrics.com/lyrics/radiohead/${song}.html`
    );
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(url.href, {
      waitUntil: "networkidle2",
    });
    const lyrics = await page.evaluate(() => {
      const lyricsDiv = document.querySelector(
        "div:not([class]):not([id]):not([style])"
      );
      return lyricsDiv ? lyricsDiv.textContent.trim().split("\n") : null;
    });
    return lyrics;
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports.bot = (event, context, callback) => {
  let lyrics, tryLimit;
  let copyright = "\n\n \u00A9 @Radiohead";
  const artistID = "4Z8W4fKeB5YxbusRsdQVPb";
  const limit = "38";
  (async () => {
    try {
      const discography = await getDiscography(artistID, limit);
      console.log(discography);
      do {
        const { url, song, date, albumName } = getRandomSong(discography);
        lyrics = await scrapeLyrics(url);
        copyright += ` - ${song} \n${date} #${albumName}`;
        tryLimit += 1;
      } while (!lyrics || tryLimit <= 15);
      const numberOfParagraphs = countParagraphs(lyrics);
      await tweet(lyrics, numberOfParagraphs, copyright);
      return callback(null, { body: JSON.stringify({ message: "success" }) });
    } catch (e) {
      console.log(e);
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify(e),
      });
    }
  })();
};
