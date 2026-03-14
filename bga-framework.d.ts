type ElementOrId = Element | string;

declare const define: Function;

declare const ebg: {
  core: {
    gamegui: any;
  }
  counter: {
    new (): Counter;
  };
  popindialog: {
    new (): PopinDialog;
  };
};

declare const dojo: Dojo;

declare const gameui: GameGui;

/**
 * Global contains replay number in live game, it is set to undefined (i.e. not set) when it is not a replay mode, so consequentially the good check is typeof g_replayFrom != 'undefined' which returns true if the game is in replay mode during the game (the game is ongoing but the user clicked "replay from this move" in the log)
 */
declare const g_replayFrom: number | undefined;

/**
 * The URL to the root of the game files, for example to access dynamically to an image.
 * 
 * @deprecated use this.bga.images.getImgUrl()
 */
declare const g_gamethemeurl: string;

/**
 * Returns true if the game is in archive mode after the game (the game has ended)
 */
declare const g_archive_mode: boolean;

/**
 * Returns an object if the game is in tutorial mode, or undefined otherwise. 
 */
declare const g_tutorialwritten: Object | undefined;

/**
 * Returns a translated sentence.
 * 
 * @param str english sentence
 */
declare function _(str: string): string;

/**
 * Get an HTML element using its "id" attribute. 
 * @param text element id
 */
declare function $(text: ElementOrId): HTMLElement;

/**
 * Loads a versionned BGA game lib.
 * 
 * @param name the name of the lib, usually prefixed by `bga-`
 * @param version the version, either taking the last available version `1.x` or a fixed version `1.0.0`
 */
declare function getLibUrl(name: string, version: string): string;

/**
 * Loads a versionned ESM lib.
 * 
 * Example of usage: `const BgaAnimations = await importEsmLib('bga-animations', '1.x');`
 */
declare function importEsmLib(name: string, version: string): Promise<any>;

/**
 * Loads Dojo (UMD) libs.
 * 
 * Example of usage: `const [Counter, Stock] = await importDojoLibs(["ebg/counter", "ebg/stock"]);`
 */
declare function importDojoLibs(names: string[]): Promise<any[]>;

interface Gamestate {
    active_player?: string;
    args: any;
    id: string;
    name: string;
    type: string;
    description?: string;
    descriptionmyturn?: string;
    private_state?: Gamestate;
}

interface Gamedatas<P extends Player = Player> {
  gamestate: Gamestate;
  gamestates: { [gamestateId: number]: Gamestate };
  playerorder: (string | number)[];
  players: { [playerId: number]: P };
}

interface Player {
  beginner: boolean;
  color: string;
  color_back: any | null;
  eliminated: number;
  id: string;
  is_ai: string;
  name: string;
  score: string;
  zombie: number;
}

declare class GameNotifQueue {
  next_log_id: number;

  /**
   * Set the notification deinfed by notif_type as "synchronous"
   * @param notif_type - the type of notification
   * @param duration - the duration of notification wait in milliseconds
   * If "duration" is specified: set a simple timer for it (milliseconds)
   * If "duration" is not specified, the notification handler MUST call "setSynchronousDuration"
   */
  setSynchronous(notif_type: string, duration?: number): void;
  /**
   * Set dynamically the duration of a synchronous notification
   * MUST be called if your notification has not been associated with a duration in "setSynchronous"
   * @param duration - how long to hold off till next notficiation received (milliseconds)
   */
  setSynchronousDuration(duration: number): void;

  /**
   * Ignore notification if predicate is true
   * @param notif_type  - the type of notificatio
   * @param predicate - the function that if returned true will make framework not dispatch notification.
   * NOTE: this cannot be used for syncronious unbound notifications
   */
  setIgnoreNotificationCheck(notif_type: string, predicate: (notif: object) => boolean): void;
}

declare class StatusBar {
  /**
   * Set the title displayed on the status bar. Il will automatically apply styling on `${you}`, `${actplayer}`, or any variable passed in args (for example, entering state args).
   * 
   * @param {string} title the title to set
   * @param {Object} args the optional args to use in format_string_recursive to format the title
   */
  setTitle(title: string, args?: any): void;

  /**
   * Add a button to the status bar.
   * 
   * @param {string} label the button text
   * @param {Function} callback the function to trigger when clicked
   * @param {Object} params the optional parameters, by default { color: 'primary', id: null, classes: '', destination: document.getElementById('generalactions'), title: undefined, disabled: false, tooltip: undefined, confirm: undefined, autoclick: false }. 
   *   `color` can be primary (default) (blue), secondary (gray), alert (red)
   *   `id` is the id to set. If null/undefined, the button will not have an id, but you can still manipulate it by storing the reference to the DOM Element returned by the function
   *   `classes` can be a string or an array, so `'disabled blinking'` and `['disabled', 'blinking']` are both possible.
   *   `destination` the DOM Element to add the button to. If not specified, will add it to the status bar.
   *   `title` plain text description of the label. Should be set when the button label is an icon, for accessibility
   *   `disabled` boolean to make the button disabled. Will prevent the callback to be executed
   *   `tooltip` the tooltip of the button
   *   `confirm` the confirm message to display before triggering the callback, if set.
   *   `autoclick` if the button should be auto clicked after a small delay (for Confirmation buttons).
   * 
   * @returns the button DOM element
   */
  addActionButton(label: string, callback: Function, params?: {
    color?: 'primary' | 'secondary' | 'alert';
    id?: string;
    classes?: string | string[];
    destination?: HTMLElement;
    title?: string;
    disabled?: boolean;
    tooltip?: string;
    confirm?: string | (() => string | undefined | null); 
    autoclick?: boolean | { abortSignal?: AbortSignal, pausable?: boolean };
  }): HTMLButtonElement;

  /**
   * Remove all buttons on the status bar
   */
  removeActionButtons(): void;
}

declare class Images {
  /**
   * Tell the interface to not preload a specific image in your img root directory.
   * 
   * @param {string} image the filename
   */
  dontPreloadImage(image: string): void;

  /**
   * Tell the interface to not preload specific images in your img root directory.
   * 
   * @param {string[]} images the filenames
   */
  dontPreloadImages(images: string[]): void;

  /**
   * Tell the interface to preload a specific image in your img directory.
   * 
   * @param {string} image the filename
   */
  preloadImage(image: string): void;

  /**
   * Tell the interface to preload specific images in your img directory.
   * 
   * @param {string[]} images the filenames
   */
  preloadImages(images: string[]): void;

  /**
   * Returns the img root url, or the image url if a file name is provided.
   * 
   * @param {string | undefined} filename 
   * @returns string
   */
  getImgUrl(filename?: string): string;
}

declare class Sounds {
  /**
   * Load a sound file to be used with play.
   * 
   * @param {string} id the id to be used by play
   * @param {string} fileName the file name, without extension (there should be a .ogg and a .mp3 with that file name in the img folder). If unset, it will try with the id as file name.
   */
  load(id: string, fileName: string): void;

  /**
   * Play the sound with the given id.
   * 
   * @param {string} id the sound id
   */
  play(id: string): void;
}

declare class UserPreferences {
  onChange?: (prefId: number, value: number) => void;

  /**
   * Get a game-specific user preference value.
   */
  get(prefId: number): number;

  /**
   * Method to programmatically change a game-specific user preference.
   */
  set(prefId: number, value: number): void;

  /**
   * Hide or show a game-specific user preference.
   */
  toggleVisibility(prefId: number, visible?: boolean): void;
}

declare class Players<P extends Player = Player> {
  /**
   * Return the id of the player who is looking at the game. The player may not be part of the game (i.e. spectator)
   * @returns {number} the current player id
   */
  getCurrentPlayerId(): number;

  /**
   * Return the current player data stored in gamedatas.players.
   * Can be undefined, if the player isn't at this table (spectator).
   * 
   * @returns {P | undefined} the player
   */
  getCurrentPlayer(): P | undefined;

  /**
   * Returns true if the player on whose browser the code is running is a spectator.
   *
   * @returns {boolean} is current player spectator
   */
  isCurrentPlayerSpectator(): boolean;

  /**
   * Returns true if the player on whose browser the code is running is currently active (it's his turn to play).
   *
   * @returns {boolean} is current player active
   */
  isCurrentPlayerActive(): boolean;

  /**
   * Returns true if the player is currently active (it's his turn to play).
   *
   * @param {number} player_id the player to check
   * @returns {boolean} is specified player active
   */
  isPlayerActive(player_id: number): boolean;

  /**
   * Return the id of the active player, or null if we are not in an ACTIVE_PLAYER type state.
   * @returns {number | null} the active player id
   */
  getActivePlayerId(): number | null;

  /**
   * Return the active player, or null if we are not in an ACTIVE_PLAYER type state.
   * 
   * @returns {P | null} the active player
   */
  getActivePlayer(): P | null;

  /**
   * Return the player data stored in gamedatas.players.
   * Can be undefined, if the player isn't at this table (spectator).
   * 
   * @returns {P | undefined} the player
   */
  getPlayer(playerId: number) : P | undefined;

  /**
   * Return the HTML code for a player name, colored and with optional background.
   * Set params `replaceByYou: true` to write "You" in current player's language instead of the player's name.
   *
   * @param {number} playerId the player id
   * @param {Object} params the call parameters, by default { replaceByYou: false }.
   * @return {string} the formatted player name
   */
  getFormattedPlayerName(playerId: number, params?: {
    replaceByYou?: boolean;
  }): string;

  /**
   * Get the list of current active players ids
   * @returns {number[]} the active player ids
   */
  getActivePlayerIds(): number[];

  /**
   * Get the avatar url of a player.
   * 
   * @param {number} playerId the player id to get the avatar from (or 0 to get the default avatar)
   * @param {32 | 50 | 92 | 184} size the size of the avatar, can be 32, 50, 92 or 184 (default)
   * @returns the avatar url
   */
  getPlayerAvatarUrl(playerId: number, size?: number): string;
}

declare class Actions {
  /**
   * Trigger an ajax call for a game action.
   *
   * @param {string} action the action name
   * @param {Object} args the action arguments
   * @param {Object} params the call parameters, by default { lock: true, checkAction: true, checkPossibleActions: false, ignoreDefaultErrorHandler: false }. Must be overriden to disable interface lock, or to disable checkAction.
   * @returns Promise of the ajax call, or undefined if there is no call (prevented by checkAction/checkPossibleActions)
   */
  performAction(action: string, args?: any, params?: {
    lock?: boolean;
    checkAction?: boolean;
    checkPossibleActions?: boolean; 
    ignoreDefaultErrorHandler?: boolean;
  }): Promise<any>;

  /**
   * Check if player can do the specified action by taking into account:
   *  - if interface is locked it will return false and show message "An action is already in progress", unless nomessage set to true
   *  - if player is not active it will return false and show message "This is not your turn", unless nomessage set to true
   *  - if action is not in list of possible actions (defined by "possibleaction" in current game state) it will return false and show "This move is not authorized now" error (unconditionally).
   *  - otherwise returns true
   *
   * @param {string} action the action to test
   * @param {boolean} nomessage if we want a silent check
   * @returns {boolean} the action is possible
   */
  checkAction(action: string, nomessage?: boolean): boolean;

  /**
   * This is independent of the player being active, so can be used instead of this.checkAction(). This is particularly useful for multiplayer states when the player is not active in a 'player may like to change their mind' scenario. Unlike this.checkAction, this function does NOT take interface locking into account
   * if action is not in list of possible actions (defined by "possibleaction" in current game state) it will return false and show "This move is not authorized now" error (unconditionally).
   * otherwise returns true
   *
   * @param {string} action the action to test
   * @returns {boolean} the action is possible
   */
  checkPossibleActions(action: string): boolean;
}

declare class Notifications {
    /**
     * Auto-detect all notifications declared on the game object (functions starting with `notif_`)
     * and register them with dojo.subscribe.
     * Registered notifications will be synchronous and will have a minimum duration (if animations are active, by default 500ms with text and 1ms without).
     * If the notification function returns a Promise, the notification will end when the promise AND the minimum durations are over.
     * In case of a notification function returning a Promise, the dev is rsponsible to make it resolve instantaneously if animations are not active.
     *
     * Example of usage: `setupNotifications() { this.notifications.setupPromiseNotifications(); }`
     * And declaration of a notif will just be :
     * `notif_playedCard: function(args) { this.getPlayerTable(args.playerId).playCard(args.card); }`
     *
     * @param {Object} params the call parameters, by default { prefix: 'notif_', minDuration: 500, minDurationNoText: 1, logger: null, ignoreNotifications: [], onStart: undefined, onEnd: undefined, }.
     */
    setupPromiseNotifications(params?: {
      prefix?: string;
      minDuration?: number;
      minDurationNoText?: number;
      handlers?: Object[];
      logger?: Function;
      ignoreNotifications?: string[];
      onStart?: (notifName: string, msg: string, args: any) => any;
      onEnd?: (notifName: string, msg: string, args: any) => any;
    }): void;
}

declare class GameArea {
  /**
   * Return the Game Area div (for all displayed game components).
   *
   * @returns the Game Area div element
   */
  getElement(): HTMLDivElement;

  /**
   * Display a banner to tell the players it's the last turn.
   * 
   * @param {string} message the message to display. It should be translated, so surrounded by `_()`. If unset: "This is the last turn!"
   * @param {Object} args (optional) the args to replace in the message.
   */
  addLastTurnBanner(message?: string, args?: any): void;

  /**
   * Remove the last turn banner (for example if the player cancelled a move triggering the last turn).
   */
  removeLastTurnBanner(): void;

  /**
   * Display a banner to tell the players what win condition was reached (for games with multiple win conditions).
   * 
   * @param {string} message the message to display. It should be translated, so surrounded by `_()`.
   * @param {Object} args (optional) the args to replace in the message.
   */
  addWinConditionBanner(message: string, args?: any): void;
}

declare class PlayerPanels {
  /**
   * Return the div on the player board where the dev can add counters and other game specific indicators.
   *
   * @param {number} playerId the player id
   * @returns the div element for game specific content on player panels
   */
  getElement(playerId: number): HTMLDivElement;

  /**
   * Return the score counter of a player.
   *
   * @param {number} playerId the player id
   * @returns the score counter
   */
  getScoreCounter(playerId: number): Counter;

  /**
   * Add a player panel for an automata.
   *
   * @param {number} id the automata id, used to setup scoreCtrl and playerPanels.getElement. 0 or negative value is recommended, to avoid conflict with real player ids.
   * @param {string} name the name of the automata
   * @param {Object} params an object with optional params: color (default black), iconClass (default unset) to set a background image (32px x 32px), score (default undefined)
   */
  addAutomataPlayerPanel(id: number, name: string, params: {
      color?: string;
      iconClass?: string;
      score?: number;
  }): void;
}

declare class Dialogs {
  /**
   * Show an information message during few seconds on page head
   * @param {string} msg the string to display. It should be translated.
   * @param {string} type "info", "error", "only_to_log" If set to "info", the message will be an informative message on a white background. If set to "error", the message will be an error message on a red background and it will be added to log. If set to "only_to_log", the message will be added to the game log but will not popup at the top of the screen.
   */
  showMessage(msg: string, type: 'info' | 'error' | 'only_to_log'): void;

  /**
   * Shows predefined user error that move is unauthorized now.
   */
  showMoveUnauthorized(): void;

  /**
   * When an important action with a lot of consequences is triggered by the player, you may want to propose a confirmation dialog. 
   * 
   * @param {string} text message will be shown to user, use _() to translate
   * @return {Promise<boolean>} the result of the user choice
   */
  confirmation(text: string): Promise<boolean>;

  /**
   * You can use this dialog to give user a choice with small amount of options.
   *
   * @param {string} text message will be shown to user, use _() to translate
   * @param {Object} choices associative array "value => text to display"
   * @return {Promise<string | null>} the key of the selected choice, or null if closed
   */
  multipleChoice(text: string, choices: { [value: number]: string }): Promise<string | null>;
}

declare class States {
    /**
     * Set a logger to log entering/leaving state.
     * 
     * Typical usage would be: `this.bga.states.logger = console.log;`
     */
    logger: Function | null;

    /**
     * Associate a state class with a state name (or id).
     * 
     * Typical usage would be: `this.bga.states.register('chooseAction', new ChooseActionState(this, this.bga));`.
     * 
     * The state instance can declare `onEnteringState` / `onLeavingState` / `onPlayerActivationChange` and can access a property called `args` that is automatically filled.
     * 
     * @param {string|number} stateIdOrName the name (or id) of the state
     * @param {Object} stateClass the instanciated state class
     */
    register(stateIdOrName: string|number, stateClass: Object): void;

    /**
     * Get a state class by state name
     * 
     * @param {string} stateName state name
     * @returns {Object} the instanciated state class
     */
    getStateClass(stateName: string): Object;

    /**
     * Get the current main state name (ignore private states)
     * 
     * @returns {string} the current main state name
     */
    getCurrentMainStateName(): string;

    /**
     * Get the current player state name (private state name if there is one)
     * 
     * @returns {string} the current player state name
     */
    getCurrentPlayerStateName(): string;

    /**
     * Get the current main state class (ignore private states)
     * 
     * @returns {Object} the current main state class (instance)
     */
    getCurrentMainStateClass(): Object;

    /**
     * Get the current player state class (private state if there is one)
     * 
     * @returns {Object} the current player state class (instance)
     */
    getCurrentPlayerStateClass(): Object;

    /**
     * @returns {Object[]} the registered state classes (instances)
     */
    getStateClasses(): Object[];

    /**
     * Client state is an override of a real server game state, useful in some situations where several steps  must be done on client side without any server interaction.
     * Client state acts like a server game state. Real current server game state can be restored with "restoreServerGameState" method.
     *
     * @param {string} stateName the name of the state
     * @param {Object} args the state args
     */
    setClientState(stateName: string, args: Object): void;

    /**
     * Restore the current server state (when you are in client state).
     */
    restoreServerGameState(): void;
    
    /**
     * @returns if the current state is a client state
     */
    isOnClientState(): boolean;
}

interface Bga<P extends Player = Player, G extends Gamedatas<P> = Gamedatas<P>> {
  gameui: GameGui<P, G>;
  statusBar: StatusBar;
  images: Images;
  sounds: Sounds;
  userPreferences: UserPreferences;
  players: Players<P>;
  actions: Actions;
  notifications: Notifications;
  gameArea: GameArea;
  playerPanels: PlayerPanels;
  dialogs: Dialogs;
  states: States;
}

declare class GameGui<P extends Player = Player, G extends Gamedatas<P> = Gamedatas<P>> {
  /**
   * Return true if the game is in realtime. Note that having a distinct behavior in realtime and turn-based should be exceptional.
   */
  bRealtime: boolean;  

  /**
   * Returns true during replay/archive mode if animations should be skipped.
   * 
   * @deprecated use this.bga.gameui.bgaAnimationsActive() instead
   */
  instantaneousMode: boolean;

  /**
   * Contains the initial set of data to init the game, created at game start or by game refresh (F5).
   */
  gamedatas: G;

  /**
   * id of the player who is looking at the game. The player may not be part of the game (i.e. spectator) 
   */
  player_id: number;

  /**
   * Flag set to true if the user at the table is a spectator (not a player). 
   * 
   * @deprecated use this.bga.players.isCurrentPlayerSpectator()
   */  
  isSpectator: boolean;

  /**
   * @deprecated use this.bga.states.isOnClientState();
   */  
  on_client_state: boolean;

  /**
   * The player panel score counters.
   * 
   * @deprecated use this.bga.playerPanels.getScoreCounter
   */
  scoreCtrl: {[player_id: number]: Counter};

  bga: Bga<P, G>;

  statusBar: StatusBar;
  sounds: Sounds;

  /**
   * Setup the whole game GUI with datas from the game
   */
  setup(gamedatas: G): void;

  /**
   * This method is called each time we enter a new game state. You can use this method to perform some user interface changes at this moment. To access state arguments passed via calling php arg* method use args?.args. Typically you would do something only for active player, using this.isCurrentPlayerActive() check. It is also called (for the current game state only) when doing a browser refresh (after the setup method is called).
   * 
   * Warning: for MULTIPLE_ACTIVE_PLAYER states: the active players are NOT active yet so you must use onUpdateActionButtons to perform the client side operation which depends on a player active/inactive status. If you are doing initialization of some structures which do not depend on the active player, you can just replace (this.isCurrentPlayerActive()) with (!this.isSpectator) for the main switch in that method. 
   * 
   * @param {string} stateName the name of the state
   * @param {Object} args an object containing the state args
   */
  onEnteringState(stateName: string, args: { args: {[key: string]: any} | null; }): void;

  /**
   * This method is called each time we leave a game state. You can use this method to perform some user interface changes at this point (i.e. cleanup). 
   * 
   * @param {string} stateName the name of the state
   */
  onLeavingState(stateName: string): void;

  /**
   * In this method you can manage "action buttons" that are displayed in the action status bar and highlight active UI elements. 
   * To access state arguments passed via calling php arg* method use args parameter. 
   * 
   * Note: args can be null! For game states and when you don't supply state args function - it is null.
   * 
   * This method is called when the active or multiactive player changes. In a classic ACTIVE_PLAYER state this method is called before the onEnteringState state. 
   * In MULTIPLE_ACTIVE_PLAYER state it is called when a player "active" state changes, so it can be called multiple times during the state.
   * 
   * @param {string} stateName the name of the state
   * @param {Object} args the state args
   */
  onUpdateActionButtons(stateName: string, args: {[key: string]: any} | null): void;

  /**
   * @deprecated use this.bga.states.setClientState
   */
  setClientState(stateName: string, args: {[key: string]: any}): void;

  /**
   * @deprecated use this.bga.states.restoreServerGameState
   */
  restoreServerGameState(): void;

  /**
   * Disable the standard "move" sound for this move (to replace it with your custom sound).
   * To be added in a notification handler.
   */
  disableNextMoveSound(): void;


  /**
   * This function can be overridden in your game to manage some resizing on the client side when the browser window is resized. This function is also triggered at load time, so it can be used to adapt to the :viewport size at the start of the game too.
   */
  onScreenWidthChange(): void;

  /**
   * Returns the getBoundingClientRect ignoring the possible zoom factor linked to the autoscale.
   * Same behaviour as getBoundingClientRect/dojo.position for old browser, but the result is different for browser using the new CSS property norm (Chrome 128+, Firefox mobile)
   * 
   * @param {*} obj element or id of element
   * @returns the bounding client rect full size
   */
  getBoundingClientRectIgnoreZoom(obj: ElementOrId): DOMRect;

  /**
   * Returns true if the player on whose browser the code is running is currently active (it's his turn to play).
   * 
   * @returns {boolean} is current player active
   * 
   * @deprecated use this.bga.players.isCurrentPlayerActive()
   */
  isCurrentPlayerActive(): boolean;

  /**
   * Returns true if the player is currently active (it's his turn to play).
   * 
   * @param {number} player_id the player to check
   * @returns {boolean} is specified player active
   * 
   * @deprecated use this.bga.players.isPlayerActive
   */
  isPlayerActive(player_id: number): boolean;

  /**
   * Get the list of current active players ids
   * @returns {number[]} the active player ids
   * 
   * @deprecated use this.bga.players.getActivePlayerIds
   */
  getActivePlayers(): number[];

  /**
   * Return the id of the active player, or null if we are not in an ACTIVE_PLAYER type state. 
   * @returns {number | null} the active player id
   * 
   * @deprecated use this.bga.players.getActivePlayerId
   */
  getActivePlayerId(): number | null;

  /**
   * Return the HTML code for a player name, colored and with optional background.
   * Set params `replaceByYou: true` to write "You" in current player's language instead of the player's name.
   * 
   * @param {number} playerId the player id
   * @param {Object} params the call parameters, by default { replaceByYou: false }.
   * @return {string} the formatted player name
   * 
   * @deprecated use this.bga.players.getFormattedPlayerName
   */
  getFormattedPlayerName(playerId: number, params?: {
    replaceByYou?: boolean;
  }): string;

  /**
   * This function allows to update the current page title and turn description according to the game state arguments. 
   * Note: this functional also will calls this.onUpdateActionButtons.
   * 
   * @deprecated If you just want to change the page title, use `this.bga.statusBar.setTitle`
   */
  updatePageTitle(): void;

  /**
   * @deprecated use this.bga.statusBar.addActionButton instead
   */
  addActionButton(id: string, label: string, method: string | Function, destination?: string, blinking?: boolean, color?: string): void;

  /**
   * @deprecated use this.bga.statusBar.removeActionButtons instead
   */
  removeActionButtons(): void;

  /**
   * @deprecated use the.bga.actions.performAction
   */
  ajaxcall(url: string, args: object, bind: GameGui, resultHandler: (result: any) => void, allHandler?: (err: any, result?: any) => void): void;

  /**
   * Check if player can do the specified action by taking into account:
   *  - if interface is locked it will return false and show message "An action is already in progress", unless nomessage set to true
   *  - if player is not active it will return false and show message "This is not your turn", unless nomessage set to true
   *  - if action is not in list of possible actions (defined by "possibleaction" in current game state) it will return false and show "This move is not authorized now" error (unconditionally).
   *  - otherwise returns true
   * 
   * @param {string} action the action to test
   * @param {boolean} nomessage if we want a silent check. default false.
   * @returns {boolean} the action is possible
   * 
   * @deprecated use this.bga.actions.checkAction
   */
  checkAction(action: string, nomessage?: boolean): boolean;

  /**
   * This is independent of the player being active, so can be used instead of this.checkAction(). This is particularly useful for multiplayer states when the player is not active in a 'player may like to change their mind' scenario. Unlike this.checkAction, this function does NOT take interface locking into account
   * if action is not in list of possible actions (defined by "possibleaction" in current game state) it will return false and show "This move is not authorized now" error (unconditionally).
   * otherwise returns true
   * 
   * @param {string} action the action to test
   * @returns {boolean} the action is possible
   * 
   * @deprecated use this.bga.actions.checkPossibleActions
   */
  checkPossibleActions(action: string): boolean;

  /**
   * Shows predefined user error that move is unauthorized now.
   * 
   * @deprecated use this.bga.dialogs.showMoveUnauthorized
   */
  showMoveUnauthorized(): void;

  /**
   * Tell the interface to not preload a specific image in your img root directory. 
   * @param {string} image the filename
   * 
   * @deprecated use this.bga.images.dontPreloadImage / dontPreloadImages
   */
  dontPreloadImage(image: string): void;

  /**
   * Ensure some specific images are loaded.
   * 
   * @deprecated use this.bga.images.preloadImage / preloadImages
   */
  ensureSpecificGameImageLoading( imagelist: string[]): void;

  /**
   * Function to know if animations should be played.
   * Animations should not be played in instantaneousMode, or if the tab is not displayed in the browser.
   * 
   * @returns {boolean} if animations should be played
   */
  bgaAnimationsActive(): boolean;

  /**
   * Return a Promise that resolves at the end of a given number of ms.
   * If animations are not active, resolve instantaneously.
   * 
   * @param {number} delay the time to wait, in milliseconds
   * @returns a promise when the timer ends
   */
  wait(delay: number): Promise<any>;

  /**
   * Auto-detect all notifications declared on the game object (functions starting with `notif_`)
   * and register them with dojo.subscribe.
   * Registered notifications will be synchronous and will have a minimum duration (if animations are active, by default 500ms with text and 1ms without).
   * If the notification function returns a Promise, the notification will end when the promise AND the minimum durations are over.
   * In case of a notification function returning a Promise, the dev is rsponsible to make it resolve instantaneously if animations are not active.
   * 
   * Example of usage: `setupNotifications() { this.bgaSetupPromiseNotifications(); }`
   * And declaration of a notif will just be :
   * `notif_playedCard: function(args) { this.getPlayerTable(args.playerId).playCard(args.card); }`
   * 
   * @param {Object} params the call parameters, by default { prefix: 'notif_', minDuration: 500, minDurationNoText: 1, logger: null, ignoreNotifications: [], onStart: undefined, onEnd: undefined, }.
   * 
   * @deprecated use this.bga.notifications.setupPromiseNotifications
   */
  bgaSetupPromiseNotifications(params?: {
    prefix?: string;
    minDuration?: number;
    minDurationNoText?: number;
    handlers?: Object[];
    logger?: Function;
    ignoreNotifications?: string[];
    onStart?: (notifName: string, msg: string, args: any) => any;
    onEnd?: (notifName: string, msg: string, args: any) => any;
  }): void;

  /**
   * Play a dojo animation and returns a promise resolved when it ends.
   * 
   * @param {Object} anim the dojo animation.
   */
  bgaPlayDojoAnimation(anim: DojoAnimation): Promise<any>;

  /**
   * @deprecated use this.bga.userPreferences.get(pref_id)
   */
  getGameUserPreference(pref_id: number): number;

  /**
   * @deprecated use this.bga.userPreferences.set(pref_id, value)
   */
  setGameUserPreference(pref_id: number, value: number): void;

  /**
   * Trigger an ajax call for a game action.
   * 
   * @param {string} action the action name
   * @param {Object} args the action arguments
   * @param {Object} params the call parameters, by default { lock: true, checkAction: true, checkPossibleActions: false }. Must be overriden to disable interface lock, or to disable checkAction.
   * @returns Promise of the ajax call, or undefined if there is no call (prevented by checkAction/checkPossibleActions)
   * 
   * @deprecated use the.bga.actions.performAction, note that the result of the catch is now `{ message, args }` instead of `message`
   */
  bgaPerformAction(action: string, args?: any, params?: {
    lock?: boolean;
    checkAction?: boolean;
    checkPossibleActions?: boolean; 
  }): Promise<any>;

  /**
   * Return the Game Area div (for all displayed game components).
   * 
   * @returns the Game Area div element
   * 
   * @deprecated use this.bga.gameArea.getElement()
   */
  getGameAreaElement(): HTMLDivElement;

  /**
   * Return the div on the player board where the dev can add counters and other game specific indicators.
   * 
   * @param {number} playerId the player id
   * @returns the div element for game specific content on player panels
   * 
   * @deprecated use this.bga.playerPanels.getElement
   */
  getPlayerPanelElement(playerId: number): HTMLDivElement;

  /**
   * Updates the log/args before display, for example for formatting text notification with icons.
   * 
   * @param log the log text
   * @param args the log args
   * @returns {Object} you must `return { log, args };`
   */
  bgaFormatText(log: string, args: any): { log: string; args: any; };

  /**
   * Allow the games to declare a `bgaFormatText` function that will be called at the beginning of each 
   * format_string_recursive call. 
   * 
   * @deprecated use bgaFormatText instead
   */
  format_string_recursive(log: string, args: any): string;

  /**
   * Show an information message during few seconds on page head
   * @param {string} msg the string to display. It should be translated.
   * @param {string} type "info", "error", "only_to_log" If set to "info", the message will be an informative message on a white background. If set to "error", the message will be an error message on a red background and it will be added to log. If set to "only_to_log", the message will be added to the game log but will not popup at the top of the screen.
   * 
   * @deprecated use this.bga.dialogs.showMessage
   */
  showMessage(msg: string, type: 'info' | 'error' | 'only_to_log'): void;

  /**
   * substitute variables in a string
   * @param {string} string the string
   * @param {Object} args the substitutions
   * @returns {string} the updated string
   */
  format_string( string: string, args: {[key: string]: string}): string;


  /**
   * Places mobile_obj on target_obj, set the absolute positions and centers the mobile_obj on target_obj, effect is immediate 
   * This is not really an animation, but placeOnObject is frequently used before starting an animation. 
   * 
   * Note: if it does not work check that:
   *  1°) mobile_obj has a position:absolute or position:relative
   *  2°) a fixed mobile_obj parent has a position absolute or relative
   */
  placeOnObject(mobile_obj: ElementOrId, target_obj: ElementOrId): void;
  
  /**
   * Place an object on another one with a delta (in px).
   * 
   * Note: if it does not work check that:
   *  1°) mobile_obj has a position:absolute or position:relative
   *  2°) a fixed mobile_obj parent has a position absolute or relative
   */
  placeOnObjectPos(mobile_obj: ElementOrId, target_obj: ElementOrId, target_x: number, target_y: number): void;
        
  /**
   * Attach mobile_obj to a new parent, keeping its absolute position in the screen constant.
   * !! mobile_obj is no longer valid after that (a new corresponding mobile_obj is returned)
   */
  attachToNewParent( mobile_obj: ElementOrId, new_parent: ElementOrId): HTMLElement;
               
  /**
   * Return an animation that is moving (slide) a DOM object over another one
   */
  slideToObject(mobile_obj: ElementOrId, target_obj: ElementOrId, duration?: number, delay?: number): DojoAnimation;
  
  /**
   * Return an animation that is moving (slide) a DOM object over another one at the given coordinates
   */
  slideToObjectPos(mobile_obj: ElementOrId, target_obj: ElementOrId, target_x: number, target_y: number, duration?: number, delay?: number): DojoAnimation;

  /**
   * Create a temporary object and slide it from a point to another one, then destroy it.
   */
  slideTemporaryObject(mobile_obj_html: string, mobile_obj_parent: ElementOrId, from: ElementOrId, to: ElementOrId, duration?: number, delay?: number): DojoAnimation;

  /**
   * Slide an existing object to a destination, then destroy it.
   */
  slideToObjectAndDestroy(mobile_obj: ElementOrId, target_obj: ElementOrId, duration?: number, delay?: number): DojoAnimation;

  /**
   * Destroy an existing node with a smooth fadeout.
   */
  fadeOutAndDestroy(node: ElementOrId, duration?: number, delay?: number): DojoAnimation;
        
  /**
   * It starts the animation, and stored the rotation degree in the class, so next time you rotate object - it is additive.
   * The animation is triggered instantly.
   */
  rotateTo(node: ElementOrId, degree: number): DojoAnimation;
        
  /**
   * Rotate with no animation.
   */
  rotateInstantTo(node: ElementOrId, degree: number): void;

  /**
   * Add a simple text tooltip to the DOM node.
   * Specify 'helpStringTranslated' to display some information about "what is this game element?". 
   * Specify 'actionStringTranslated' to display some information about "what happens when I click on this element?". 
   * Set one of them to '' if unused.
   * 
   * @param {string} id the object id to attach the tooltip to.
   * @param {string} help the help message
   * @param {string} action the action message
   * @param {number} delay optional delay, in ms (default 400) 
   */
  addTooltip(nodeId: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;

  /**
   * Add an HTML tooltip to the DOM node.
   * 
   * @param {string} id the object id to attach the tooltip to.
   * @param {string} html the html code of the message
   * @param {number} delay optional delay, in ms (default 400) 
   */
  addTooltipHtml(nodeId: string, html: string, delay?: number): void;
        
  /**
   * Same as addTooltip but for all elements of a given class.
   */
  addTooltipToClass(cssclass: string, helpStringTranslated: string, actionStringTranslated: string, delay?: number): void;
  
  /**
   * Same as addTooltipHtml but for all elements of a given class.
   */
  addTooltipHtmlToClass( cssclass: string, html: string, delay?: number): void;

  /**
   * Remove a tooltip from the DOM node with given id. 
   * 
   * @param {string} id the object id to attach the tooltip to.
   */
  removeTooltip(nodeId: string): void;

  /**
   * When an important action with a lot of consequences is triggered by the player, you may want to propose a confirmation dialog. 
   * 
   * @param {string} text message will be shown to user, use _() to translate
   * @param {Function} callback callback if confirmed
   * @param {Function} callback_cancel callback if cancelled
   * 
   * @deprecated use this.bga.dialogs.confirmation. Note that signature changed and it now uses Promise.
   */
  confirmationDialog(text: string, callback: Function, callback_cancel?: Function): void;

  /**
   * You can use this dialog to give user a choice with small amount of options .
   * 
   * @param {string} text message will be shown to user, use _() to translate
   * @param {Object} choices associative array "value => text to display"
   * @param {Function} callback callback returning the choice
   * 
   * @deprecated use this.bga.dialogs.multipleChoice. Note that signature changed and it now uses Promise.
   */
  multipleChoiceDialog(text: string, choices: { [value: number]: string }, callback: Function): void;

  /**
   * Display a score over an element.
   * 
   * @param {string} anchor_id the element to show the score on
   * @param {string} color the score color
   * @param {number} score  the score number
   * @param {number} duration  duration
   * @param {number} dx delta x
   * @param {number} dy delta y
   */
  displayScoring(anchor_id: string, color: string, score: number|string, duration?: number, offset_x?: number, offset_y?: number): void;

  /**
   * Display a text bubble over an element.
   * 
   * @param {string} anchor_id the element to show the bubble on
   * @param {string} text the bubble text
   * @param {number} duration  duration
   * @param {string} custom_class CSS class
   */
  showBubble(anchor_id: string, text: string, delay?: number, duration?: number, custom_class?: string): void;

  /**
   * Mark the player panel as disabled (by darkening the background).
   * 
   * @param {number} player_id the player to disable
   */
  disablePlayerPanel(player_id: number): void;

  /**
   * Mark the player panel as enabled.
   * 
   * @param {number} player_id the player to enable
   */
  enablePlayerPanel(player_id: number): void;

  /**
   * Mark all player panels as enabled.
   */
  enableAllPlayerPanels(): void;

  /**
   * Add a player panel for an automata.
   *
   * @param {number} id the automata id, used to setup scoreCtrl and getPlayerPanelElement. 0 or negative value is recommended, to avoid conflict with real player ids.
   * @param {string} name the name of the automata
   * @param {Object} params an object with optional params: color (default black), iconClass (default unset) to set a background image (32px x 32px), score (default undefined)
   * 
   * @deprecated use this.bga.players.addAutomataPlayerPanel
   */
  addAutomataPlayerPanel(id: number, name: string, params: {
      color?: string;
      iconClass?: string;
      score?: number;
  }): void;

  /**
   * Display a banner to tell the players it's the last turn.
   * 
   * @param {string} message the message to display. It should be translated, so surrounded by `_()`. If unset: "This is the last turn!"
   * @param {Object} args (optional) the args to replace in the message.
   * 
   * @deprecated use this.bga.gameArea.addLastTurnBanner
   */
  addLastTurnBanner(message?: string, args?: any): void;

  /**
   * Remove the last turn banner (for example if the player cancelled a move triggering the last turn).
   * 
   * @deprecated use this.bga.gameArea.removeLastTurnBanner
   */
  removeLastTurnBanner(): void;

  /**
   * Display a banner to tell the players what win condition was reached (for games with multiple win conditions).
   * 
   * @param {string} message the message to display. It should be translated, so surrounded by `_()`.
   * @param {Object} args (optional) the args to replace in the message.
   * 
   * @deprecated use this.bga.gameArea.addWinConditionBanner
   */
  addWinConditionBanner(message: string, args?: any): void;
}

declare interface Notif<T = any> {
  type: string; // type of the notification (as passed by php function)
  log: string; // the log string passed from php notification
  args: T; // This is the arguments that you passed on your notification method on php
  bIsTableMsg: boolean; // is true when you use [[Main_game_logic:_yourgamename.game.php#NotifyAllPlayers|NotifyAllPlayers]] method (false otherwise)
  move_id: number; // ID of the move associated with the notification
  time: number; // UNIX GMT timestamp
  uid: number; // unique identifier of the notification
}

declare class Counter {
  constructor();

  /**
   * Associate the counter with an existing HTML element.
   * 
   * @param {HTMLElement | string} target the HTML Element that will display the counter
   * @param {Object | undefined} settings to set the initial value, define settings.value (null to disable). Set settings.tableCounter to link it to a TableCounter, or settings.playerCounter and settings.playerId to link it to a PlayerCounter.
   */
  create(target: ElementOrId, settings?: { value?: number | null; tableCounter?: string; playerCounter?: string; playerId?: number; }): void;

  /**
   * Return the current value.
   * 
   * @returns the current value
   */
  getValue(): number;

  /**
   * Increment the value and animate from the previous value.
   * 
   * @param {number} increment the increment to add to current value
   * @returns the new value
   */
  incValue(by: number): number;
  
  /**
   * Set the value (no animation).
   * 
   * @param {number} value the new value
   */
  setValue(value: number): void;

  /**
   * Set the value, with animation.
   * 
   * @param {number} value the new value
   */
  toValue(value: number): void;

  /**
   * Sets the value to "-". 
   * 
   * Note it just changes display value once, it does not actually disable it, i.e. if you set it again, it will be shown again.
   */
  disable(): void;
}

declare class PopinDialog {
  /**
   * Create the popin on the DOM.
   * 
   * @param {string} id popin id
   */
  create(id: string): void;

  /**
   * Remove the popin.
   */
  destroy(): void;

  /**
   * Replace the close callback (top right corner 'close' icon) by a custom one.
   * 
   * @param {Function} callback the new callback
   */
  replaceCloseCallback(callback: Function): void;
  
  /**
   * Hide the close button.
   */
  hideCloseIcon(): void;

  /**
   * Set the popin title.
   * 
   * @param {string} title the title
   */
  setTitle(title: string): void;

  /**
   * Set the popin max width.
   * 
   * @param {number} maxwidth the max width, in px
   */
  setMaxWidth(maxwidth: number): void;
  
  /**
   * Set the content of the popin.
   * 
   * @param {string} html the popin content
   */
  setContent(html: string): void;

  /**
   * Show the popin.
   */
  show(): void;
  
  /**
   * Hide the popin.
   */
  hide(): void;
}

declare interface StockItems {
    id: string;
    type: number;
    loc?: string;
}

declare interface StockItemType {
    weight: number;
    image: string;
    image_position: number;
}

declare class Stock {
    items: StockItems[];
    item_type: { [cardUniqueId: number]: StockItemType };
    selectionClass: string;
    container_div: HTMLDivElement;
    control_name: string; // the container_div id
    centerItems: boolean;
    image_items_per_row: number;

    create(game: GameGui, container_div: HTMLDivElement, cardwidth: number, cardheight: number): void;
    setSelectionMode(selectionMode: number): void; 
    updateDisplay(from?: string): void;
    setSelectionAppearance(appearance: string): void;
    addToStock(cardUniqueId: number): void;
    addToStockWithId(cardUniqueId: number, cardId: string, from?: string): void;
    addItemType(cardUniqueId: number, cardWeight: number, cardsurl: string, imagePosition: number): void;	
    getSelectedItems(): any[];
    unselectAll(): void;
    removeAll(): void;
    removeFromStockById(id: string, to?: string): void;
    removeAllTo(to: string): void;
    unselectItem(id: string): void;
    setOverlap(horizontal_percent: number, vertical_percent: number): void;
    onItemCreate(itemDiv: HTMLElement, itemType: number, itemDivId: string): any; 
    onChangeSelection(control_name: string, item_id?: string ): any;
}

declare class DojoAnimation {
  play(): void;
}

interface Dojo {
    attr: Function;
    create: Function;
    place: (html: string, nodeId: string, action?: string) => void;
    style: Function;
    hitch: Function;
    hasClass: (nodeId: string, className: string) => boolean;
    addClass: (nodeId: string, className: string) => void;
    removeClass: (nodeId: string, className?: string) => void;
    toggleClass: (nodeId: string, className: string, forceValue?: boolean) => void;
    connect: (node: HTMLElement, eventType: string, callback: Function) => any;
    disconnect: Function;
    query: Function;
    subscribe: Function;
    string: any;
    fx: any;
    marginBox: Function;
    position: Function;
    contentBox: Function;
    clone: Function;
    fadeIn: Function;
    trim: Function;
    stopEvent: (evt: Event) => void;
    destroy: (nodeId: string) => void;
    forEach: Function;
    empty: (nodeId: ElementOrId) => void;
    byId: (nodeId: ElementOrId) => HTMLElement;
}