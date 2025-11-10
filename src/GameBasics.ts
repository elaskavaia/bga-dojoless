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
  setup(gamedatas: any) {
    console.log("Starting game setup", gamedatas);
  }

  onEnteringState(stateName: string, eargs: { args: object }) {
    console.log("onEnteringState", stateName, eargs, this.debugStateInfo());
    this.curstate = stateName;
    // Call appropriate method
    const args = eargs?.args; // this method has extra wrapper for args for some reason
    const methodName = "onEnteringState_" + stateName;
    this.callfn(methodName, args);

    if (this.pendingUpdate) {
      this.onUpdateActionButtons(stateName, args);
      this.pendingUpdate = false;
    }
  }

  onLeavingState(stateName: string) {
    console.log("onLeavingState", stateName, this.debugStateInfo());
    this.currentPlayerWasActive = false;
    const methodName = "onLeavingState_" + stateName;
    this.callfn(methodName, {});
  }

  onUpdateActionButtons(stateName: string, args: object) {
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
    let replayMode = false;
    if (typeof g_replayFrom != "undefined") {
      replayMode = true;
    }

    const res = {
      isCurrentPlayerActive: gameui.isCurrentPlayerActive(),
      animationsActive: gameui.bgaAnimationsActive(),
      replayMode: replayMode
    };
    return res;
  }

  callfn(methodName: string, args: object) {
    if (this[methodName] !== undefined) {
      console.log("Calling " + methodName, args);
      return this[methodName](args);
    }
    return undefined;
  }
  /** @Override onScriptError from gameui */
  onScriptError(msg: any, url, linenumber) {
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

  bgaFormatText(log: string, args: any) {
    if (log && args && !args.processed) {
      args.processed = true;

      if (args.player_id && !args.player_name) {
        args.player_name = this.gamedatas.players[args.player_id].name;
      }
    }

    return { log, args };
  }
}
