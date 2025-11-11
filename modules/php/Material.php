<?php

declare(strict_types=1);

namespace Bga\Games\dojoless;

use Bga\Games\dojoless\Game;

class Material {
    private array $token_types;
    private bool $adjusted = false;
    public function __construct() {
        $this->token_types = [];
    }

    public function get() {
        return $this->token_types;
    }

    public function adjustMaterial() {
        if ($this->adjusted) {
            return $this->token_types;
        }
        $this->adjusted = true;
        // ... do something reald number or palyer of game options with material
        return $this->token_types;
    }
}
