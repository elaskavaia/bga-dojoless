<?php

declare(strict_types=1);

namespace Bga\Games\dojoless\States;

use Bga\GameFramework\StateType;
use Bga\Games\dojoless\Game;
use Bga\GameFramework\States\GameState;
use Bga\Games\dojoless\StateConstants;

class NextPlayer extends GameState {
    public function __construct(protected Game $game) {
        parent::__construct(
            $game,
            id: StateConstants::STATE_NEXT_PLAYER,
            //
            type: StateType::GAME
        );
    }

    public function onEnteringState() {
        $game = $this->game;
        if ($game->isEndOfGame()) {
            return StateConstants::STATE_END_GAME;
        }

        // Standard case (not the end of the trick)
        // => just active the next player
        $player_id = $game->activeNextPlayer();
        $game->giveExtraTime($player_id);
        return PlayerTurn::class;
    }
}
