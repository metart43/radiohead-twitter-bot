const puppeteer = require("puppeteer");

const getBrowser = async () => {
  //helper function to launch browser. Function is beign reused to make sure browser is running.
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--proxy-bypass-list=*",
        "--single-process",
        "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
      ],
    });
    return browser;
  } catch (e) {
    console.log("getBrowser.js#error starting a browser ", e);
    return null;
  }
};

module.exports = getBrowser;
