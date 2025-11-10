/** Game class */
class GameBody extends GameBasics {
  custom: CustomModule;
  constructor() {
    super();
    this.custom = new CustomModule(); // this example of class from custom module
  }

  setup(gamedatas) {
    super.setup(gamedatas);
    //super.setup(gamedatas);

    this.getGameAreaElement().insertAdjacentHTML(
      "beforeend",
      ` 
<div id="thething">
  <div class="whiteblock cow">${_("Should we eat the cow now?")}</div>
</div>
      `
    );

    this.custom.setup(gamedatas);
    this.setupNotifications();
    console.log("Ending game setup");
  }

  // on click hooks
  onButtonClick(event) {
    console.log("onButtonClick", event);
  }

  onUpdateActionButtons_PlayerTurn(args) {
    this.statusBar.addActionButton(_("Play Card"), () => this.bgaPerformAction("action_playCard", { card_id: 1 }));
    this.statusBar.addActionButton(_("Vote"), () => this.bgaPerformAction("action_playVote"));
    this.statusBar.addActionButton(_("Pass"), () => this.bgaPerformAction("action_pass"));
  }
  onUpdateActionButtons_MultiPlayerTurn(args) {
    this.statusBar.addActionButton(_("Support"), () => this.bgaPerformAction("action_playSupport"));
    this.statusBar.addActionButton(_("Oppose"), () => this.bgaPerformAction("action_playOppose"));
    this.statusBar.addActionButton(_("Wait"), () => this.bgaPerformAction("action_playWait"));
  }

  setupNotifications() {
    console.log("notifications subscriptions setup");

    // automatically listen to the notifications, based on the `notif_xxx` function on this class.
    this.bgaSetupPromiseNotifications();
  }
  notif_message(args: any): void {
    console.log("notif", args);
  }
}
