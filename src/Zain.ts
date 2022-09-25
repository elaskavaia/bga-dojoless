
define([
  "dojo",
  "dojo/_base/declare",
  "ebg/core/gamegui",
  "ebg/counter"
], function (dojo, declare) {
  declare("bgagame.dojoless", ebg.core.gamegui, new GameBody());
});
