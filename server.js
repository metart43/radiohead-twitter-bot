const express = require("express");
const app = express();
const axios = require("axios");
const puppeteer = require("puppeteer");
const getRandomSong = require("./getRandomSong");
const tweet = require("./tweet.js");
const dotenv = require("dotenv");

dotenv.config();
let browser;

const getBrowser = async () => {
  //helper function to launch browser. Function is beign reused to make sure browser is running.
  if (!browser) {
    try {
      browser = await puppeteer.launch({
        dumpio: false,
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--proxy-bypass-list=*",
        ],
      });
      return browser;
    } catch (e) {
      return null;
    }
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
    console.log(song);
    await getBrowser();
    const url = new URL(
      `https://web.archive.org/web/20200706040347/https://www.azlyrics.com/lyrics/radiohead/${song}.html`
    );
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(url.href, {
      waitUntil: "networkidle2",
    });
    const lyrics = await page.evaluate(() => {
      const lyricsDiv = document.querySelectorAll(
        "div:not([class]):not([id]):not([style])"
      )[2];
      console.log(lyricsDiv, lyricsDiv.textContent);
      return lyricsDiv ? lyricsDiv.textContent.trim().split("\n") : null;
    });
    return lyrics;
  } catch (e) {
    console.log(e);
    return null;
  }
};

app.get("/tweet", (request, response) => {
  let song, lyrics;
  (async () => {
    try {
      getBrowser();
      const url = "https://strong-boulder-mouth.glitch.me/";
      const res = await axios({
        method: "GET",
        url,
      });
      const { data } = res;
      do {
        song = getRandomSong(data);
        lyrics = await scrapeLyrics(song);
      } while (!lyrics);
      const numberOfParagraphs = countParagraphs(lyrics);
      await tweet(lyrics, numberOfParagraphs);
      response.end("success");
    } catch (e) {
      console.log(e);
      response.send(e);
    }
  })();
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
