<?php

declare(strict_types=1);

namespace Bga\Games\dojoless;

class StateConstants {
    const STATE_PLAYER_TURN = 2;
    const STATE_NEXT_PLAYER = 3;
    const STATE_MULTI_PLAYER_TURN = 4;

    // last state
    const STATE_END_GAME = 99;
}
