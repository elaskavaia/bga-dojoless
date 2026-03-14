<?php

declare(strict_types=1);

namespace Bga\Games\dojoless\Tests\Stubs;

use Bga\Games\dojoless\Game;

class GameUT extends Game {
    function __construct() {
        parent::__construct();
    }

    function init() {
        $players = [
            1 => ["player_name" => "Player 1", "player_color" => "ff0000"],
            2 => ["player_name" => "Player 2", "player_color" => "0000ff"],
        ];
        $this->setupNewGame($players);
    }
}
