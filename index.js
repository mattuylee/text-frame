const devMode = process.env.NODE_ENV === 'development';

const TextFrame = require('./dist/umd/text-frame-min')
  , TextFrameDev = require('./dist/umd/text-frame');
let _exports;
if (devMode) {
  _exports = TextFrameDev;
}
else {
  _exports = TextFrame;
}
module.exports = _exports;
