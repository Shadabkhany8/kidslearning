// Polyfill for util.styleText which was introduced in Node v20.12.0
const util = require('util');

if (typeof util.styleText !== 'function') {
  const codes = {
    bold: [1, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    white: [37, 39],
    grey: [90, 39],
    gray: [90, 39],
    black: [30, 39],
    blue: [34, 39],
    cyan: [36, 39],
    green: [32, 39],
    magenta: [35, 39],
    red: [31, 39],
    yellow: [33, 39],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
  };

  util.styleText = function (format, text) {
    const formats = Array.isArray(format) ? format : [format];
    let open = '';
    let close = '';
    for (const f of formats) {
      if (codes[f]) {
        open += `\x1b[${codes[f][0]}m`;
        close = `\x1b[${codes[f][1]}m` + close;
      }
    }
    return open + text + close;
  };
}
