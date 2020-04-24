const fs = require("fs");
const path = require("path");

const minimalcss = require("minimalcss");
const httpServer = require("http-server");

const HTML_BODY = `
<p>Hi Peterbe</p>
`;

const CSSes = [
  `
h1 {
  color: red;
}
p,
li {
  font-weight: bold;
}
`,
];

(async () => {
  const csses = CSSes.map((css, i) => {
    fs.writeFileSync(`_${i}.css`, css);
    return `<link rel="stylesheet" href="_${i}.css">`;
  });
  const html = `<!doctype html><html>
  <head>${csses}</head>
  <body>${HTML_BODY}</body>
  </html>`;
  const fp = path.resolve("./_index.html");
  fs.writeFileSync(fp, html);
  const server = httpServer.createServer({
    root: path.dirname(fp),
  });
  server.listen(8080);

  let result;
  try {
    result = await minimalcss.minimize({
      urls: ["http://0.0.0.0:8080/" + path.basename(fp)],
    });
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    server.close();
    fs.unlinkSync(fp);
    CSSes.forEach((_, i) => fs.unlinkSync(`_${i}.css`));
  }

  console.log(result.finalCss);
})();
