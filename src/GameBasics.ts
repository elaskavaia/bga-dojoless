// @ts-ignore
GameGui = /** @class */ (function () {
  function GameGui() {}
  return GameGui;
})();


/** Class that extends default bga core game class with more functionality
 */

class GameBasics extends GameGui {
  curstate: string | undefined;
  pendingUpdate: boolean;
  currentPlayerWasActive: boolean;
  constructor() {
    super();
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
    args = args ? args.args : null; // this method has extra wrapper for args for some reason
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
  ajaxcallwrapper(action: string, args?: any, handler?) {
    if (!args) {
      args = {};
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

  createHtml(divstr: string, location?: string) {
    const tempHolder = document.createElement("div");
    tempHolder.innerHTML = divstr;
    const div = tempHolder.firstElementChild;
    const parentNode = document.getElementById(location);
    if (parentNode) parentNode.appendChild(div);
    return div;
  }

  createDiv(id?: string | undefined, classes?: string, location?: string) {
    const div = document.createElement("div");
    if (id) div.id  = id;
    if (classes) div.classList.add(...classes.split(" "));
    const parentNode = document.getElementById(location);
    if (parentNode) parentNode.appendChild(div);
    return div;
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
    // cannot call super - dojo still have to used here
    //super.onScriptError(msg, url, linenumber);
    return this.inherited(arguments);
  }
}
