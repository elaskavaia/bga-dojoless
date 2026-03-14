/**
 * Custom module
 */
class CustomModule {
    setup(gamedatas) {
        this.gamedatas = gamedatas;
        console.log("hello from setup of MyFoo");
    }
}

class PlayerTurnState {
    constructor(game, bga) {
        this.game = game;
        this.bga = bga;
    }
    onEnteringState(args, isCurrentPlayerActive) {
        this.bga.statusBar.addActionButton(_("Play Card"), () => this.bga.actions.performAction("action_playCard", { card_id: 1 }));
        this.bga.statusBar.addActionButton(_("Vote"), () => this.bga.actions.performAction("action_playVote"));
        this.bga.statusBar.addActionButton(_("Pass"), () => this.bga.actions.performAction("action_pass"));
    }
    onLeavingState(args, isCurrentPlayerActive) { }
}
class MultiPlayerTurnState {
    constructor(game, bga) {
        this.game = game;
        this.bga = bga;
    }
    onEnteringState(args, isCurrentPlayerActive) {
        this.bga.statusBar.addActionButton(_("Support"), () => this.bga.actions.performAction("action_playSupport"));
        this.bga.statusBar.addActionButton(_("Oppose"), () => this.bga.actions.performAction("action_playOppose"));
        this.bga.statusBar.addActionButton(_("Wait"), () => this.bga.actions.performAction("action_playWait"));
    }
    onLeavingState(args, isCurrentPlayerActive) { }
}
/** Game class */
class Game {
    constructor(bga) {
        this.bga = bga;
        this.custom = new CustomModule();
        this.bga.states.register("PlayerTurn", new PlayerTurnState(this, bga));
        this.bga.states.register("MultiPlayerTurn", new MultiPlayerTurnState(this, bga));
    }
    setup(gamedatas) {
        console.log("Setup, current player", this.player_id);
        this.gamedatas = gamedatas;
        this.bga.gameArea.getElement().insertAdjacentHTML("beforeend", `
<div id="thething">
  <div class="whiteblock cow">${_("Should we eat the cow now?")}</div>
</div>
      `);
        this.custom.setup(gamedatas);
        // automatically listen to the notifications, based on the `notif_xxx` function on this class.
        this.bga.notifications.setupPromiseNotifications();
        console.log("Ending game setup");
    }
    // proxies for GameGui properties/methods accessed via gameui
    get player_id() {
        return gameui.player_id;
    }
    bgaFormatText(log, args) {
        if (log && args && !args.processed) {
            args.processed = true;
            if (args.player_id && !args.player_name) {
                args.player_name = this.gamedatas.players[args.player_id].name;
            }
        }
        return { log, args };
    }
    notif_message(args) {
        console.log("notif", args);
    }
}

export { Game };
