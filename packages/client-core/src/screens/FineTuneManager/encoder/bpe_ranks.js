/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync, writeFileSync } = require("fs");

function range(x, y) {
  return Array.from(Array(y).keys()).slice(x);
}

function dictZip(x, y) {
  const result = {};
  x.map((_, i) => {
    result[x[i]] = y[i];
  });
  return result;
}

const bpe_file = readFileSync("./lib/vocab.bpe", "utf8");
const lines = bpe_file.split("\n");

// bpe_merges = [tuple(merge_str.split()) for merge_str in bpe_data.split("\n")[1:-1]]
const bpe_merges = lines.slice(1, lines.length - 1).map((x) => {
  return x.split(/(\s+)/).filter(function (e) {
    return e.trim().length > 0;
  });
});
const bpe_ranks = dictZip(bpe_merges, range(0, bpe_merges.length));

writeFileSync("./lib/bpe_ranks.json", JSON.stringify(bpe_ranks));
