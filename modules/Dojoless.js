//@ts-check

/** Class that extends default bga core game class with more functionality
 *  All overrides must go here
 */

/** @extends GameGui */
 class GameBasics {
    constructor() {
      console.log("game constructor");
  
      this.curstate = null;
      this.pendingUpdate = false;
      this.currentPlayerWasActive = false;
    }
  
    // state hooks
    setup(gamedatas) {
      console.log("Starting game setup", gameui);
      this.gamedatas = gamedatas;
    }
  
    onEnteringState(stateName, args) {
      console.log("onEnteringState: " + stateName, args, this.debugStateInfo());
      this.curstate = stateName;
      // Call appropriate method
      args = args?.args; // this method has extra wrapper for args for some reason
      var methodName = "onEnteringState_" + stateName;
      this.callfn(methodName, args);
  
      if (this.pendingUpdate) {
        this.onUpdateActionButtons(stateName, args);
        this.pendingUpdate = false;
      }
    }
  
    onLeavingState(stateName) {
      console.log("onLeavingState: " + stateName, this.debugStateInfo());
      this.currentPlayerWasActive = false;
    }
  
    onUpdateActionButtons(stateName, args) {
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
      } else {
        this.currentPlayerWasActive = false;
      }
    }
  
    // utils
    debugStateInfo() {
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
    }
    ajaxcallwrapper(action, args, handler) {
      if (!args) {
        args = [];
      }
      args.lock = true;
  
      if (gameui.checkAction(action)) {
        gameui.ajaxcall(
          "/" + gameui.game_name + "/" + gameui.game_name + "/" + action + ".html",
          args, //
          gameui,
          (result) => {},
          handler
        );
      }
    }
    /**
     *
     * @param {string} methodName
     * @param {object} args
     * @returns
     */
    callfn(methodName, args) {
      if (this[methodName] !== undefined) {
        console.log("Calling " + methodName, args);
        return this[methodName](args);
      }
      return undefined;
    }
    /** @Override onScriptError from gameui */
    onScriptError(msg, url, linenumber) {
      if (gameui.page_is_unloading) {
        // Don't report errors during page unloading
        return;
      }
      // In anycase, report these errors in the console
      console.error(msg);
      // this is parent method from gameui - we have to call it this way
      // @ts-ignore
      gameui.super.onScriptError(msg, url, linenumber);
    }
  }
  
  /** Game class */
  
  class Dojoless extends GameBasics {
    constructor() {
      super();
      this.varfoo = new MyFoo(); // this example of class from custom module
    }
  
    setup(gamedatas) {
      super.setup(gamedatas);
      //super.setup(gamedatas);
      dojo.create("div", { class: "whiteblock", innerHTML: _("hello 2") }, "thething");
      this.varfoo.setup(gamedatas);
      console.log("Ending game setup");
    }
    
    // on click hooks
    onButtonClick(event) {
      console.log("onButtonClick", event);
    }
  
    onUpdateActionButtons_playerTurnA(args) {
      gameui.addActionButton("b1", _("Play Card"), () => this.ajaxcallwrapper("playCard"));
      gameui.addActionButton("b2", _("Vote"), () => this.ajaxcallwrapper("playVote"));
      gameui.addActionButton("b3", _("Pass"), () => this.ajaxcallwrapper("pass"));
    }
    onUpdateActionButtons_playerTurnB(args) {
      gameui.addActionButton("b1", _("Support"), () => this.ajaxcallwrapper("playSupport"));
      gameui.addActionButton("b2", _("Oppose"), () => this.ajaxcallwrapper("playOppose"));
      gameui.addActionButton("b3", _("Wait"), () => this.ajaxcallwrapper("playWait"));
    }
  }