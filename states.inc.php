<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * dojoless implementation : © Alena Laskavaia <laskava@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 * 
 * states.inc.php
 *
 * dojoless game states description
 *
 */

/*
   Game state machine is a tool used to facilitate game developpement by doing common stuff that can be set up
   in a very easy way from this configuration file.

   Please check the BGA Studio presentation about game state to understand this, and associated documentation.

   Summary:

   States types:
   _ activeplayer: in this type of state, we expect some action from the active player.
   _ multipleactiveplayer: in this type of state, we expect some action from multiple players (the active players)
   _ game: this is an intermediary state where we don't expect any actions from players. Your game logic must decide what is the next game state.
   _ manager: special type for initial and final state

   Arguments of game states:
   _ name: the name of the GameState, in order you can recognize it on your own code.
   _ description: the description of the current game state is always displayed in the action status bar on
                  the top of the game. Most of the time this is useless for game state with "game" type.
   _ descriptionmyturn: the description of the current game state when it's your turn.
   _ type: defines the type of game states (activeplayer / multipleactiveplayer / game / manager)
   _ action: name of the method to call when this game state become the current game state. Usually, the
             action method is prefixed by "st" (ex: "stMyGameStateName").
   _ possibleactions: array that specify possible player actions on this step. It allows you to use "checkAction"
                      method on both client side (Javacript: this.checkAction) and server side (PHP: self::checkAction).
   _ transitions: the transitions are the possible paths to go from a game state to another. You must name
                  transitions in order to use transition names in "nextState" PHP method, and use IDs to
                  specify the next game state for each transition.
   _ args: name of the method to call to retrieve arguments for this gamestate. Arguments are sent to the
           client side to be used on "onEnteringState" or to set arguments in the gamestate description.
   _ updateGameProgression: when specified, the game progression is updated (=> call to your getGameProgression
                            method).
*/

//    !! It is not a good idea to modify this file when a game is running !!

if (!defined('STATE_END_GAME')) { // guard since this included multiple times
    define("STATE_PLAYER_TURN_A", 2);
    define("STATE_GAME_TURN_NEXT_PLAYER", 3);
    define("STATE_MPLAYER_TURN_B", 4);
    define("STATE_END_GAME", 99);
}
 
$machinestates = array(

    // The initial state. Please do not modify.
    1 => array(
        "name" => "gameSetup",
        "description" => "",
        "type" => "manager",
        "action" => "stGameSetup",
        "transitions" => array( "" => STATE_PLAYER_TURN_A )
    ),
    


    STATE_PLAYER_TURN_A => array(
    		"name" => "playerTurnA",
    		"description" => clienttranslate('${actplayer} must play a card or pass'),
    		"descriptionmyturn" => clienttranslate('${you} must play a card or pass'),
    		"type" => "activeplayer",
            "args"=>"arg_playerTurnA",
            "possibleactions" => array( "playCard", "playVote", "pass" ),
            "transitions" => array( 
                    "next" => STATE_GAME_TURN_NEXT_PLAYER, 
                    "pass" => STATE_GAME_TURN_NEXT_PLAYER,
                    "vote" => STATE_MPLAYER_TURN_B, )
    ),
        
    STATE_GAME_TURN_NEXT_PLAYER => array(
             "name" => "gameTurnNextPlayer",
             "description" => '',
             "type" => "game",
             "action" => "st_gameTurnNextPlayer",
             "updateGameProgression" => true,
             "transitions" => array(
                        "next" => STATE_PLAYER_TURN_A,
                        "loopback" =>  STATE_GAME_TURN_NEXT_PLAYER,
                         "last" => STATE_MPLAYER_TURN_B), 
    ),
        
     STATE_MPLAYER_TURN_B => array (
                "name" => "playerTurnB",
                "type" => "multipleactiveplayer",
                "action" => "stMakeEveryoneActive",
                "description" => clienttranslate('Other players must choose to support ${otherplayer} or oppose'),
                "descriptionmyturn" => clienttranslate('${you} must choose to support ${otherplayer} or oppose'),
                "possibleactions" => array ("playSupport","playOppose","playWait" ),
                "transitions" => array (
                        "next" => STATE_PLAYER_TURN_A,
                        "loopback" => STATE_MPLAYER_TURN_B,
                ),
                "args" => "arg_playerTurnB"
     ),
    
 
   
    // Final state.
    // Please do not modify.
        STATE_END_GAME => array(
        "name" => "gameEnd",
        "description" => clienttranslate("End of game"),
        "type" => "manager",
        "action" => "stGameEnd",
        "args" => "argGameEnd"
    )

);



