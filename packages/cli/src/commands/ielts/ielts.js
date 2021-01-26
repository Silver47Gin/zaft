const fs = require("fs");
const path = require("path");
const request = require("superagent");
const cheerio = require("cheerio");
require("superagent-proxy")(request);

const FILE_IELTS = path.resolve(__dirname, "ielts.txt");
const FILE_WORDS = path.resolve(__dirname, "words.txt");
const PROXY = "http://127.0.0.1:61235";

const getTranslateOutPath = (i) =>
  path.resolve(__dirname, `words-enTranslate-${i}.txt`);

const reg = /(\w+).+/;
const getTranslateApiUrl = (w) =>
  `https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD/${w}`;

const generateWords = () => {
  const words = [];
  const lines = fs.readFileSync(FILE_IELTS).toString().split("\n");
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const matches = reg.exec(line);
    if (matches && matches.length) {
      words.push(matches[1]);
    }
  }
  fs.writeFileSync(FILE_WORDS, words.join("\n"));
};

const getWords = () => fs.readFileSync(FILE_WORDS).toString().split("\n");

const requestWord = (w) =>
  new Promise((resolve, reject) =>
    request()
      .proxy(PROXY)
      .get(getTranslateApiUrl(word))
      .end(function () {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      })
  );

const fetchWord = async (word) => {
  const res = await requestWord(word);
  const $ = cheerio.load(res.text);
  $(".def.ddef_d.db .query").each(function () {
    const aText = $(this).html();
    $(this).replaceWith(aText);
  });
  $(".def.ddef_d.db .nondv-xref.dnondv-xref").each(function () {
    const aText = $(this).html();
    $(this).replaceWith(aText);
  });
  const enTranslate = $(".def.ddef_d.db").html();
  return enTranslate;
};

(async () => {
  const words = getWords();
  let queue = [];
  let i = 0;
  for (const word of words) {
    const enTranslate = await fetchWord(word);
    i++;
    if (i > 100) {
      fs.writeFileSync(getTranslateOutPath(i), JSON.stringify(queue));
      i = 0;
      queue = [];
    }
    queue.push({
      word,
      enTranslate,
    });
    console.log(`${word}: ${enTranslate}`);
  }
})();
