declare var gameui: GameGui;
declare var g_replayFrom: number | undefined;
declare var g_gamethemeurl: string;
declare var g_themeurl: string;
declare var g_archive_mode: boolean;
declare function _(str: string): string;
declare function $(text: string): Element;

declare const define;
declare const ebg;
declare const dojo;
declare type eventhandler = (event?: any) => void;

declare class GameNotif {
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
declare class GameGui {
  page_is_unloading: any;
  game_name: string;
  instantaneousMode: boolean;
  player_id: number;
  interface_min_width: number;
  gamedatas: object;
  isSpectator: boolean;
  bRealtime: boolean;
  notifqueue: GameNotif;

  isCurrentPlayerActive(): boolean;
  getActivePlayerId(): number;
  addActionButton(id: string, label: string, method: string | eventhandler, destination?: string, blinking?: boolean, color?: string): void;
  checkAction(action: any): boolean;
  ajaxcall(url: string, args: object, bind: GameGui, resultHandler: (result: any) => void, allHandler: (err: any) => void): void;
  connect(node: Element, ontype: string, handler: any): void;
  disconnect(node: Element, ontype: string): void;

  setup(gamedatas: any): void;
  onEnteringState(stateName: string, args: { args: any } | null): void;
  onLeavingState(stateName: string): void;
  onUpdateActionButtons(stateName: string, args: any): void;
  setupNotifications(): void;

  onScriptError(msg: string, url?: string, linenumber?: number): void;
  inherited(args: any): any;
}
