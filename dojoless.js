var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// @ts-ignore
GameGui = /** @class */ (function () {
    function GameGui() { }
    return GameGui;
})();
/** Class that extends default bga core game class with more functionality
 */
var GameBasics = /** @class */ (function (_super) {
    __extends(GameBasics, _super);
    function GameBasics() {
        var _this = _super.call(this) || this;
        console.log("game constructor");
        _this.curstate = null;
        _this.pendingUpdate = false;
        _this.currentPlayerWasActive = false;
        return _this;
    }
    // state hooks
    GameBasics.prototype.setup = function (gamedatas) {
        console.log("Starting game setup", gamedatas);
    };
    GameBasics.prototype.onEnteringState = function (stateName, eargs) {
        console.log("onEnteringState", stateName, eargs, this.debugStateInfo());
        this.curstate = stateName;
        // Call appropriate method
        var args = eargs === null || eargs === void 0 ? void 0 : eargs.args; // this method has extra wrapper for args for some reason
        var methodName = "onEnteringState_" + stateName;
        this.callfn(methodName, args);
        if (this.pendingUpdate) {
            this.onUpdateActionButtons(stateName, args);
            this.pendingUpdate = false;
        }
    };
    GameBasics.prototype.onLeavingState = function (stateName) {
        console.log("onLeavingState", stateName, this.debugStateInfo());
        this.currentPlayerWasActive = false;
        var methodName = "onLeavingState_" + stateName;
        this.callfn(methodName, {});
    };
    GameBasics.prototype.onUpdateActionButtons = function (stateName, args) {
        if (this.curstate != stateName) {
            // delay firing this until onEnteringState is called so they always called in same order
            this.pendingUpdate = true;
            //console.log('   DELAYED onUpdateActionButtons');
            return;
        }
        this.pendingUpdate = false;
        if (gameui.isCurrentPlayerActive() && this.currentPlayerWasActive == false) {
            console.log("onUpdateActionButtons: " + stateName, args, this.debugStateInfo());
            this.currentPlayerWasActive = true;
            // Call appropriate method
            this.callfn("onUpdateActionButtons_" + stateName, args);
        }
        else {
            this.currentPlayerWasActive = false;
        }
    };
    // utils
    GameBasics.prototype.debugStateInfo = function () {
        var replayMode = false;
        if (typeof g_replayFrom != "undefined") {
            replayMode = true;
        }
        var res = {
            isCurrentPlayerActive: gameui.isCurrentPlayerActive(),
            animationsActive: gameui.bgaAnimationsActive(),
            replayMode: replayMode
        };
        return res;
    };
    GameBasics.prototype.callfn = function (methodName, args) {
        if (this[methodName] !== undefined) {
            console.log("Calling " + methodName, args);
            return this[methodName](args);
        }
        return undefined;
    };
    /** @Override onScriptError from gameui */
    GameBasics.prototype.onScriptError = function (msg, url, linenumber) {
        if (gameui.page_is_unloading) {
            // Don't report errors during page unloading
            return;
        }
        // In anycase, report these errors in the console
        console.error(msg);
        // cannot call super - dojo still have to used here
        //super.onScriptError(msg, url, linenumber);
        return this.inherited(arguments);
    };
    GameBasics.prototype.bgaFormatText = function (log, args) {
        if (log && args && !args.processed) {
            args.processed = true;
            if (args.player_id && !args.player_name) {
                args.player_name = this.gamedatas.players[args.player_id].name;
            }
        }
        return { log: log, args: args };
    };
    return GameBasics;
}(GameGui));
/**
 * Custom module
 */
var CustomModule = /** @class */ (function () {
    function CustomModule() {
    }
    CustomModule.prototype.setup = function (gamedatas) {
        this.gamedatas = gamedatas;
        console.log("hello from setup of MyFoo");
    };
    return CustomModule;
}());
;
/** Game class */
var GameBody = /** @class */ (function (_super) {
    __extends(GameBody, _super);
    function GameBody() {
        var _this = _super.call(this) || this;
        _this.custom = new CustomModule(); // this example of class from custom module
        return _this;
    }
    GameBody.prototype.setup = function (gamedatas) {
        _super.prototype.setup.call(this, gamedatas);
        //super.setup(gamedatas);
        this.getGameAreaElement().insertAdjacentHTML("beforeend", " \n<div id=\"thething\">\n  <div class=\"whiteblock cow\">".concat(_("Should we eat the cow now?"), "</div>\n</div>\n      "));
        this.custom.setup(gamedatas);
        this.setupNotifications();
        console.log("Ending game setup");
    };
    // on click hooks
    GameBody.prototype.onButtonClick = function (event) {
        console.log("onButtonClick", event);
    };
    GameBody.prototype.onUpdateActionButtons_PlayerTurn = function (args) {
        var _this = this;
        this.statusBar.addActionButton(_("Play Card"), function () { return _this.bgaPerformAction("action_playCard", { card_id: 1 }); });
        this.statusBar.addActionButton(_("Vote"), function () { return _this.bgaPerformAction("action_playVote"); });
        this.statusBar.addActionButton(_("Pass"), function () { return _this.bgaPerformAction("action_pass"); });
    };
    GameBody.prototype.onUpdateActionButtons_MultiPlayerTurn = function (args) {
        var _this = this;
        this.statusBar.addActionButton(_("Support"), function () { return _this.bgaPerformAction("action_playSupport"); });
        this.statusBar.addActionButton(_("Oppose"), function () { return _this.bgaPerformAction("action_playOppose"); });
        this.statusBar.addActionButton(_("Wait"), function () { return _this.bgaPerformAction("action_playWait"); });
    };
    GameBody.prototype.setupNotifications = function () {
        console.log("notifications subscriptions setup");
        // automatically listen to the notifications, based on the `notif_xxx` function on this class.
        this.bgaSetupPromiseNotifications();
    };
    GameBody.prototype.notif_message = function (args) {
        console.log("notif", args);
    };
    return GameBody;
}(GameBasics));
/**
 * This is only code that has to use dojo
 * Note: this only works when targeting ES5
 */
define([
    "dojo",
    "dojo/_base/declare",
    "ebg/core/gamegui",
    // libs
    getLibUrl("bga-animations", "1.x"),
    getLibUrl("bga-cards", "1.x")
], function (dojo, declare, gamegui, BgaAnimations, BgaCards) {
    window.BgaAnimations = BgaAnimations; //trick
    window.BgaCards = BgaCards;
    declare("bgagame.dojoless", ebg.core.gamegui, new GameBody());
});
