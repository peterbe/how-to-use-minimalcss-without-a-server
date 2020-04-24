const path = require("path");

const puppeteer = require("puppeteer");
const minimalcss = require("minimalcss");
const httpServer = require("http-server");

const HTML_FILE = "index.html";

(async () => {
  const server = httpServer.createServer({
    root: path.dirname(path.resolve(HTML_FILE)),
  });
  server.listen(8080);

  const browser = await puppeteer.launch(/* your special options */);

  let result;
  try {
    result = await minimalcss.minimize({
      urls: ["http://0.0.0.0:8080/" + path.basename(HTML_FILE)],
      browser,
    });
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await browser.close();
    server.close();
  }

  console.log(result.finalCss);
})();
