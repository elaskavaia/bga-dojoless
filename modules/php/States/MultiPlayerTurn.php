<?php

declare(strict_types=1);

namespace Bga\Games\dojoless\States;

use Bga\GameFramework\StateType;
use Bga\Games\dojoless\Game;
use Bga\GameFramework\States\PossibleAction;
use Bga\Games\dojoless\StateConstants;
use Bga\GameFramework\States\GameState;

class MultiPlayerTurn extends GameState {
    public function __construct(protected Game $game) {
        parent::__construct(
            $game,
            id: StateConstants::STATE_MULTI_PLAYER_TURN,
            type: StateType::MULTIPLE_ACTIVE_PLAYER, // This state type means that one player is active and can do actions
            description: clienttranslate('Other players must choose to support ${otherplayer} or oppose'),
            descriptionMyTurn: clienttranslate('${you} must choose to support ${otherplayer} or oppose'),
            // We suround the code with clienttranslate() so that the text is sent to the client for translation (this will enable the game to support other languages)
            transitions: [
                "next" => StateConstants::STATE_GAME_TURN_NEXT_PLAYER,
            ]
        );
    }

    public function getArgs(int $player_id): array {
        $game = $this->game;
        return ["otherplayer" => $game->getActivePlayerName(), "otherplayer_id" => $game->getActivePlayerId()];
    }

    public function onEnteringState() {
        $this->game->gamestate->setAllPlayersMultiactive();
    }

    #[PossibleAction]
    function action_playSupport(int $player_id) {
        $this->notify->all("message", clienttranslate('${player_name} supports'), [
            "player_id" => $player_id,
        ]);
        $this->gamestate->setPlayerNonMultiactive($player_id, "next");
    }
    #[PossibleAction]
    function action_playOppose(int $player_id) {
        $this->notify->all("message", clienttranslate('${player_name} opposes'), [
            "player_id" => $player_id,
        ]);
        $this->gamestate->setPlayerNonMultiactive($player_id, "next");
    }
    #[PossibleAction]
    function action_playWait(int $player_id) {
        $this->notify->all("message", clienttranslate('${player_name} waits'), [
            "player_id" => $player_id,
        ]);
        return MultiPlayerTurn::class;
    }

    public function zombie(int $playerId) {
        $this->gamestate->setPlayerNonMultiactive($playerId, "next");
    }
}
