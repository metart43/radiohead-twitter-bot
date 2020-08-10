const chromium = require("chrome-aws-lambda");
const proxtList = require("./proxy-list.json");

const getBrowser = async () => {
  //helper function to launch browser. Function is beign reused to make sure browser is running.
  const proxy = proxtList[Math.floor(Math.random() * 2004)];
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
    return browser;
  } catch (e) {
    console.log("errorBrowser", e);
    return null;
  }
};

module.exports = getBrowser;
