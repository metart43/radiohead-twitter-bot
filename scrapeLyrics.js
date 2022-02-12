const getBrowser = require("./getBrowser");

const selectors = {
  searchResultTable: ".table-condensed > tbody",
  firstSongSelector: (childNumber) => `tr:nth-child(${childNumber})`,
  lyricsSelector: "div:not([class]):not([id]):not([style])",
};

const scrapeLyrics = async ({ artist, song }) => {
  let browser;
  let lyrics;
  let firstSongElementHandle;
  try {
    browser = await getBrowser();
    const url = new URL(`https://search.azlyrics.com/search.php?q=${artist}-${song}`);
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(url.href, {
      waitUntil: "networkidle2",
    });

    const numberOfSongs = await analyzeSearchResults(page);

    if (numberOfSongs > 20) {
      firstSongElementHandle = await page.$(
        `${selectors.searchResultTable} > ${selectors.firstSongSelector(2)}`
      );
    } else if (numberOfSongs <= 20) {
      firstSongElementHandle = await page.$(
        `${selectors.searchResultTable} > ${selectors.firstSongSelector(1)}`
      );
    }

    if (firstSongElementHandle) {
      await firstSongElementHandle.click();
      await page.waitForSelector(selectors.lyricsSelector);
      lyrics = await page.evaluate(({ lyricsSelector }) => {
        const lyricsDiv = document.querySelector(lyricsSelector);
        return lyricsDiv ? lyricsDiv.textContent.trim().split("\n") : null;
      }, selectors);
    }
    console.log("here lyrics", lyrics);
  } catch (e) {
    console.error("Failed to scrape lyrics scrapeLyrics.js", e);
  } finally {
    if (browser) await browser.close();
    return lyrics;
  }
};

const analyzeSearchResults = async (page) => {
  const numberOfSongs = await page.evaluate((tableSelector) => {
    const tableBody = document.querySelector(tableSelector);
    return tableBody ? tableBody.childElementCount : 0;
  }, selectors.searchResultTable);
  return numberOfSongs;
};


module.exports = scrapeLyrics;
