/* See https://github.com/latitudegames/GPT-3-Encoder */

/* eslint-disable sonarjs/cognitive-complexity */
import bpe_ranks from "./bpe_ranks.json";
import encoder from "./encoder.json";

const range = (x, y) => {
  return Array.from(Array(y).keys()).slice(x);
};

const ord = (x) => {
  return x.charCodeAt(0);
};

const chr = (x) => {
  return String.fromCharCode(x);
};

const textEncoder = new TextEncoder("utf-8");
const encodeStr = (str) => {
  return Array.from(textEncoder.encode(str)).map((x) => x.toString());
};

function bytes_to_unicode() {
  const bs = range(ord("!"), ord("~") + 1).concat(
    range(ord("¡"), ord("¬") + 1),
    range(ord("®"), ord("ÿ") + 1)
  );

  let cs = bs.slice();
  let n = 0;
  for (let b = 0; b < 2 ** 8; b++) {
    if (!bs.includes(b)) {
      bs.push(b);
      cs.push(2 ** 8 + n);
      n = n + 1;
    }
  }

  cs = cs.map((x) => chr(x));

  const result = {};
  bs.map((_, i) => {
    result[bs[i]] = cs[i];
  });
  return result;
}

function get_pairs(word) {
  const pairs = new Set();
  let prev_char = word[0];
  for (let i = 1; i < word.length; i++) {
    const char = word[i];
    pairs.add([prev_char, char]);
    prev_char = char;
  }
  return pairs;
}

const pat =
  /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;

const decoder = {};
Object.keys(encoder).map((x) => {
  decoder[encoder[x]] = x;
});

const byte_encoder = bytes_to_unicode();
const byte_decoder = {};
Object.keys(byte_encoder).map((x) => {
  byte_decoder[byte_encoder[x]] = x;
});

const cache = {};

function bpe(token) {
  if (token in cache) {
    return cache[token];
  }

  let word = token.split("");

  let pairs = get_pairs(word);

  if (!pairs) {
    return token;
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const minPairs = {};
    Array.from(pairs).map((pair) => {
      const rank = bpe_ranks[pair];
      minPairs[isNaN(rank) ? 10e10 : rank] = pair;
    });

    const bigram =
      minPairs[
        Math.min(
          ...Object.keys(minPairs).map((x) => {
            return parseInt(x);
          })
        )
      ];

    if (!(bigram in bpe_ranks)) {
      break;
    }

    const first = bigram[0];
    const second = bigram[1];
    let new_word = [];
    let i = 0;

    while (i < word.length) {
      const j = word.indexOf(first, i);
      if (j === -1) {
        new_word = new_word.concat(word.slice(i));
        break;
      }
      new_word = new_word.concat(word.slice(i, j));
      i = j;

      if (word[i] === first && i < word.length - 1 && word[i + 1] === second) {
        new_word.push(first + second);
        i = i + 2;
      } else {
        new_word.push(word[i]);
        i = i + 1;
      }
    }

    word = new_word;
    if (word.length === 1) {
      break;
    } else {
      pairs = get_pairs(word);
    }
  }

  word = word.join(" ");
  cache[token] = word;

  return word;
}

/*
 * @param {string} text - The text to encode
 * @return {Array<number>} The tokens
 */
export default function encode(text) {
  let bpe_tokens = [];
  const matches = Array.from(text.matchAll(pat)).map((x) => x[0]);
  for (let token of matches) {
    token = encodeStr(token)
      .map((x) => {
        return byte_encoder[x];
      })
      .join("");

    const new_tokens = bpe(token)
      .split(" ")
      .map((x) => encoder[x]);
    bpe_tokens = bpe_tokens.concat(new_tokens);
  }
  return bpe_tokens;
}
