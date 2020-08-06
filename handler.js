const chromium = require("chrome-aws-lambda");
const getRandomSong = require("./getRandomSong");
const tweet = require("./tweet.js");
const getDiscography = require("get-artist-discography/getDiscography");
const proxtList = require("./proxy-list.json");

const getBrowser = async () => {
  console.log("HERE");
  //helper function to launch browser. Function is beign reused to make sure browser is running.
  const proxy = proxtList[Math.floor(Math.random() * Math.floor(2004))];
  try {
    browser = await chromium.puppeteer.launch({
      headless: true,
      executablePath: await chromium.executablePath,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        `--proxy-server=${proxy}`,
        "--proxy-bypass-list=*",
        "--single-process",
        "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
      ],
    });
    console.log(proxy);
    return browser;
  } catch (e) {
    console.log("errorBrowser", e);
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
  let browser;
  try {
    browser = await getBrowser();
    const url = new URL(
      `https://www.azlyrics.com/lyrics/radiohead/${song}.html`
    );
    const page = await browser.newPage();
    console.log(await browser.userAgent());
    page.setDefaultNavigationTimeout(0);
    await page.goto(url.href, {
      waitUntil: "networkidle2",
    });
    console.log(await page.content());
    const lyrics = await page.evaluate(() => {
      const lyricsDiv = document.querySelector(
        "div:not([class]):not([id]):not([style])"
      );
      console.log("doc", document);
      console.log("lyricsDiv", lyricsDiv);
      return lyricsDiv ? lyricsDiv.textContent.trim().split("\n") : null;
    });
    console.log("lyrics", lyrics);
    if (browser) await browser.close();
    return lyrics;
  } catch (e) {
    console.log("scraper", e);
    return null;
  }
};

<<<<<<< HEAD
module.exports.bot = async (event, context) => {
=======
module.exports.bot = async (event, context, callback) => {
>>>>>>> aws
  let lyrics, tryLimit;
  let copyright = "\n\n \u00A9 @Radiohead";
  const artistID = "4Z8W4fKeB5YxbusRsdQVPb";
  const limit = "38";
<<<<<<< HEAD
  try {
    const discography = await getDiscography(artistID, limit);
    do {
      const { url, song, date, albumName } = getRandomSong(discography);
      lyrics = await scrapeLyrics(url);
      copyright += ` - ${song} \n${date} #${albumName}`;
      tryLimit += 1;
    } while (!lyrics || tryLimit <= 15);
    const numberOfParagraphs = countParagraphs(lyrics);
    await tweet(lyrics, numberOfParagraphs, copyright);
    return { body: JSON.stringify({ message: "success" }) };
  } catch (e) {
    console.log("main", e);
    return {
      statusCode: 500,
      body: JSON.stringify(e, event, context),
    };
  }
=======
  const discography = await getDiscography(artistID, limit);
  do {
    const { url, song, date, albumName } = getRandomSong(discography);
    lyrics = await scrapeLyrics(url);
    copyright += ` - ${song} \n${date} #${albumName}`;
    tryLimit += 1;
    console.log("scrapedLyrics", lyrics);
  } while (!lyrics || tryLimit <= 3);
  const numberOfParagraphs = countParagraphs(lyrics);
  console.log("numberOfParagraphs", numberOfParagraphs);
  await tweet(lyrics, numberOfParagraphs, copyright);
  return { message: "success" };
>>>>>>> aws
};
