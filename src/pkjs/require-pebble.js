/**
 * tries to require the pebblejs submodule the pebble way then the node way
 * @param moduleName
 * @returns {*}
 */
function requirePebble(moduleName) {
  var module;
  try {
    module = require('pebblejs/' + moduleName);
  } catch (e) {
    module = require('../../node_modules/pebblejs/dist/js/' + moduleName + '.js');
  }
  return module;
}

module.exports = requirePebble;
