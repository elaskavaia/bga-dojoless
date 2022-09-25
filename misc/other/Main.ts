
define([
  "dojo",
  "dojo/_base/declare",
  "ebg/core/gamegui",
  "ebg/counter",
], function (dojo, declare, gamegui) {
  return declare("bgagame.dojoless", ebg.core.gamegui, new Dojoless());
});