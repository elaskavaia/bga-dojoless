/** Game class */
class GameBody extends GameBasics {
  varfoo: CustomModule;
  constructor() {
    super();
    this.varfoo = new CustomModule(); // this example of class from custom module
  }
  
  setup(gamedatas) {
    super.setup(gamedatas);
    //super.setup(gamedatas);
    this.createDiv(undefined,"whiteblock cow","thething").innerHTML=_("Should we eat the cow?");
    this.varfoo.setup(gamedatas);
    console.log("Ending game setup");
  }

  // on click hooks
  onButtonClick(event) {
    console.log("onButtonClick", event);
  }

  onUpdateActionButtons_playerTurnA(args) {
    this.addActionButton("b1", _("Play Card"), () => this.ajaxcallwrapper("playCard"));
    this.addActionButton("b2", _("Vote"), () => this.ajaxcallwrapper("playVote"));
    this.addActionButton("b3", _("Pass"), () => this.ajaxcallwrapper("pass"));
  }
  onUpdateActionButtons_playerTurnB(args) {
    this.addActionButton("b1", _("Support"), () => this.ajaxcallwrapper("playSupport"));
    this.addActionButton("b2", _("Oppose"), () => this.ajaxcallwrapper("playOppose"));
    this.addActionButton("b3", _("Wait"), () => this.ajaxcallwrapper("playWait"));
  }
}
