const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const getRandomSong = require("./getRandomSong");
const tweet = require("./tweet.js");
const dotenv = require("dotenv");
const getDiscography = require("get-artist-discography/getDiscography");
const proxtList = require("./proxy-list.json");

dotenv.config();

const getBrowser = async () => {
  //helper function to launch browser. Function is beign reused to make sure browser is running.
  const proxy = proxtList[Math.floor(Math.random() * Math.floor(2004))];
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        `--proxy-server=${proxy}`,
        "--proxy-bypass-list=*",
      ],
    });
    return browser;
  } catch (e) {
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

app.get("/tweet", (request, response) => {
  let lyrics, tryLimit;
  let copyright = "\n\n \u00A9 @Radiohead";
  const artistID = "4Z8W4fKeB5YxbusRsdQVPb";
  const limit = "38";
  (async () => {
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
      response.end("success");
    } catch (e) {
      response.send(e);
    }
  })();
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
