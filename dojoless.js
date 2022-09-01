/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * dojoless implementation : © Alena Laskavaia <laskava@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * dojoless.js
 *
 * dojoless user interface script
 *
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

// This is ugly dojo stuff
// See game code in modules/Dojoless.js

define([
  "dojo",
  "dojo/_base/declare",
  "ebg/core/gamegui",
  "ebg/counter", // have to stay
  g_gamethemeurl + "/modules/MyFoo.js", // custom module if needed
  g_gamethemeurl + "/modules/Dojoless.js", // this is actual game
], function (dojo, declare) {
  declare("bgagame.dojoless", [ebg.core.gamegui], {
    constructor: function () {
      customMixin(this, new Dojoless());
    },
  });
});

/**
 *
 * @param {object} dest
 * @param {object} source
 */
function customMixin(dest, source) {
  let prot = source;
  dest.super = {};
  while (Object.getPrototypeOf(prot) != Object.prototype) {
    prot = Object.getPrototypeOf(prot);
    Object.getOwnPropertyNames(prot).forEach((name) => {
      if (name !== "constructor") {
        if (dest[name] !== undefined) {
          // preserve the original for inheritance
          console.log("Overriding " + name + " " + typeof dest[name]);
          dest.super[name] = dojo.hitch(dest, dest[name]);
        }
        dest[name] = dojo.hitch(dest, source[name]);
      }
    });
  }
  dojo.safeMixin(dest, source);
}
