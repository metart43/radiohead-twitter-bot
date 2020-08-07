const getBrowser = require("./getBrowser");

const scrapeLyrics = async (artist, song) => {
  let browser;
  try {
    browser = await getBrowser();
    const url = new URL(
      `https://www.azlyrics.com/lyrics/${artist}/${song}.html`
    );
    console.log(url);
    const page = await browser.newPage();
    console.log(await browser.userAgent());
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
    console.log("lyrics", lyrics);
    if (browser) await browser.close();
    return lyrics;
  } catch (e) {
    console.log("scraper", e);
    return null;
  }
};

module.exports = scrapeLyrics;
