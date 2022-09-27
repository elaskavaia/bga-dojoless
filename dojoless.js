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
        console.log("Starting game setup", gameui);
        this.gamedatas = gamedatas;
    };
    GameBasics.prototype.onEnteringState = function (stateName, args) {
        console.log("onEnteringState: " + stateName, args, this.debugStateInfo());
        this.curstate = stateName;
        // Call appropriate method
        args = args ? args.args : null; // this method has extra wrapper for args for some reason
        var methodName = "onEnteringState_" + stateName;
        this.callfn(methodName, args);
        if (this.pendingUpdate) {
            this.onUpdateActionButtons(stateName, args);
            this.pendingUpdate = false;
        }
    };
    GameBasics.prototype.onLeavingState = function (stateName) {
        console.log("onLeavingState: " + stateName, this.debugStateInfo());
        this.currentPlayerWasActive = false;
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
        var iscurac = gameui.isCurrentPlayerActive();
        var replayMode = false;
        if (typeof g_replayFrom != "undefined") {
            replayMode = true;
        }
        var instantaneousMode = gameui.instantaneousMode ? true : false;
        var res = {
            isCurrentPlayerActive: iscurac,
            instantaneousMode: instantaneousMode,
            replayMode: replayMode,
        };
        return res;
    };
    GameBasics.prototype.ajaxcallwrapper = function (action, args, handler) {
        if (!args) {
            args = {};
        }
        args.lock = true;
        if (gameui.checkAction(action)) {
            gameui.ajaxcall("/" + gameui.game_name + "/" + gameui.game_name + "/" + action + ".html", args, //
            gameui, function (result) { }, handler);
        }
    };
    GameBasics.prototype.createHtml = function (divstr, location) {
        var tempHolder = document.createElement("div");
        tempHolder.innerHTML = divstr;
        var div = tempHolder.firstElementChild;
        var parentNode = document.getElementById(location);
        if (parentNode)
            parentNode.appendChild(div);
        return div;
    };
    GameBasics.prototype.createDiv = function (id, classes, location) {
        var _a;
        var div = document.createElement("div");
        if (id)
            div.id = id;
        if (classes)
            (_a = div.classList).add.apply(_a, classes.split(" "));
        var parentNode = document.getElementById(location);
        if (parentNode)
            parentNode.appendChild(div);
        return div;
    };
    /**
     *
     * @param {string} methodName
     * @param {object} args
     * @returns
     */
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
        _this.varfoo = new CustomModule(); // this example of class from custom module
        return _this;
    }
    GameBody.prototype.setup = function (gamedatas) {
        _super.prototype.setup.call(this, gamedatas);
        //super.setup(gamedatas);
        this.createDiv(undefined, "whiteblock cow", "thething").innerHTML = _("Should we eat the cow?");
        this.varfoo.setup(gamedatas);
        console.log("Ending game setup");
    };
    // on click hooks
    GameBody.prototype.onButtonClick = function (event) {
        console.log("onButtonClick", event);
    };
    GameBody.prototype.onUpdateActionButtons_playerTurnA = function (args) {
        var _this = this;
        this.addActionButton("b1", _("Play Card"), function () { return _this.ajaxcallwrapper("playCard"); });
        this.addActionButton("b2", _("Vote"), function () { return _this.ajaxcallwrapper("playVote"); });
        this.addActionButton("b3", _("Pass"), function () { return _this.ajaxcallwrapper("pass"); });
    };
    GameBody.prototype.onUpdateActionButtons_playerTurnB = function (args) {
        var _this = this;
        this.addActionButton("b1", _("Support"), function () { return _this.ajaxcallwrapper("playSupport"); });
        this.addActionButton("b2", _("Oppose"), function () { return _this.ajaxcallwrapper("playOppose"); });
        this.addActionButton("b3", _("Wait"), function () { return _this.ajaxcallwrapper("playWait"); });
    };
    return GameBody;
}(GameBasics));
define([
    "dojo",
    "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter"
], function (dojo, declare) {
    declare("bgagame.dojoless", ebg.core.gamegui, new GameBody());
});
