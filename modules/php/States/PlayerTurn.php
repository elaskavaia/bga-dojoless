<?php

declare(strict_types=1);

namespace Bga\Games\dojoless\States;

use Bga\GameFramework\StateType;
use Bga\Games\dojoless\Game;
use Bga\Games\dojoless\StateConstants;
use Bga\GameFramework\States\PossibleAction;
use Bga\GameFramework\States\GameState;

class PlayerTurn extends GameState {
    public function __construct(protected Game $game) {
        parent::__construct(
            $game,
            id: StateConstants::STATE_PLAYER_TURN,
            type: StateType::ACTIVE_PLAYER, // This state type means that one player is active and can do actions
            description: clienttranslate('${actplayer} must play a card or pass'), // We tell OTHER players what they are waiting for
            descriptionMyTurn: clienttranslate('${you} must play a card or pass'), // We tell the ACTIVE player what they must do
            // We suround the code with clienttranslate() so that the text is sent to the client for translation (this will enable the game to support other languages)
            transitions: [
                "next" => StateConstants::STATE_NEXT_PLAYER,
                "pass" => StateConstants::STATE_NEXT_PLAYER,
                "vote" => StateConstants::STATE_MULTI_PLAYER_TURN,
            ]
        );
    }

    public function getArgs(): array {
        return [];
    }

    public function onEnteringState() {
        //nothing
    }
    #[PossibleAction]
    function action_playCard(int $card_id, int $active_player_id) {
        $this->notify->all("message", clienttranslate('${player_name} plays ${card_name}'), [
            "player_id" => $active_player_id,
            "card_name" => $card_id,
            "card_id" => $card_id,
        ]);
        return "next";
    }
    #[PossibleAction]
    function action_playVote(int $active_player_id) {
        $this->notify->all("message", clienttranslate('${player_name} wants to vote'), [
            "player_id" => $active_player_id,
        ]);
        return "vote";
    }
    #[PossibleAction]
    function action_pass($active_player_id) {
        $this->notify->all("message", clienttranslate('${player_name} passes'), [
            "player_id" => $active_player_id,
        ]);
        return "next";
    }
    public function zombie(int $playerId) {
        return "next";
    }
}
