const getBrowser = require("./getBrowser");
let page;

const selectors = {
  searchResultTable: ".table-condensed > tbody",
  actionSearchButton: ".btn.btn-primary",
  firstSongSelector: (childNumber) => `tr:nth-child(${childNumber}) td > a`,
  lyricsSelector: "div:not([class]):not([id]):not([style])",
};

const scrapeLyrics = async ({ artist, song }) => {
  console.log("scrapping lyrics for", { song });
  let browser;
  let lyrics;
  let firstSongChildNumber;
  try {
    browser = await getBrowser();
    const url = new URL(`https://search.azlyrics.com/search.php?q=${artist}-${song}`);
    console.log("url for scraping", url);
    page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(url.href);
    await page.waitForSelector(".search");
    await page.evaluate(() => {
      document.querySelector(".search").submit();
    });
    console.log("searching for lyrics");
    await page.waitForSelector(selectors.searchResultTable);
    const searchResultTable = await page.$(selectors.searchResultTable);
    console.log("searchResultTable", searchResultTable)
    if (!searchResultTable) {
      lyrics = null;
      console.log("no search results");
      return;
    }
    const numberOfSongs = await analyzeSearchResults();
    if (numberOfSongs === 0) {
      throw new Error("No songs found");
    }
    if (numberOfSongs > 20) {
      firstSongChildNumber = 2;
      firstSongAnchorTag = await page.$(
        `${selectors.searchResultTable} > ${selectors.firstSongSelector(2)}`
      );
    } else if (numberOfSongs <= 20 && numberOfSongs > 0) {
      firstSongChildNumber = 1;
      firstSongAnchorTag = await page.$(
        `${selectors.searchResultTable} > ${selectors.firstSongSelector(1)}`
      );
    }

    if (firstSongAnchorTag) {
      const url = await getFirstSongHref(firstSongChildNumber);
      console.log("url", url);
      await page.goto(url);
      await page.waitForSelector(selectors.lyricsSelector);
      const lyricsDivExists = await page.$(selectors.lyricsSelector);
      console.log("waiting for lyrics to load");
      if (lyricsDivExists) {
        lyrics = await page.evaluate(({ lyricsSelector }) => {
          const nonClassNonIdDivsArray = document.querySelectorAll(lyricsSelector);
          if (nonClassNonIdDivsArray && nonClassNonIdDivsArray.length > 2) {
            return nonClassNonIdDivsArray[2].innerText
              .trim()
              .split("\n");
          } else {
            return null;
          }
        }, selectors);
      }
    }
    console.log("scrapeLyrics.js#scrapedLyrics => ", lyrics);
  } catch (e) {
    console.error("Failed to scrape lyrics scrapeLyrics.js#error", e);
  } finally {
    if (browser) await browser.close();
    return lyrics;
  }
};

const analyzeSearchResults = async () => {
  const numberOfSongs = await page.evaluate((tableSelector) => {
    const tableBody = document.querySelector(tableSelector);
    return tableBody ? tableBody.childElementCount : 0;
  }, selectors.searchResultTable);
  return numberOfSongs;
};

const getFirstSongHref = async (firstSongChildNumber) => {
  const href = await page.evaluate((firstSongChildNumber) => {
    const firstSongElement = document.querySelector(
      `.table-condensed > tbody > tr:nth-child(${firstSongChildNumber}) td > a`
    );
    const firstSongHref = firstSongElement.href;
    return firstSongHref;
  }, firstSongChildNumber);
  return href;
};

module.exports = scrapeLyrics;
