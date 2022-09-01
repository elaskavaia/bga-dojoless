/// <reference path="dojo.d.ts" />

declare var gameui: GameGui;
declare var g_replayFrom: number | undefined;
declare var g_gamethemeurl: string;
declare var g_themeurl: string;
declare var g_archive_mode: string;
declare function _(str: string): string;
declare var dojo: dojo;


interface GameGui {
	page_is_unloading: any;
	game_name: string;
	instantaneousMode: any;
    player_id: string;
    interface_min_width: number;
    isCurrentPlayerActive(): boolean;
    addActionButton(id: string, label: string, callback: (event?: any) => void);
    checkAction(action: any);
    ajaxcall(url: string, args: object, bind: GameGui, resultHandler: (result: any) => void, allHandler: any);
    onEnteringState(state: string);
}
