<?php

declare(strict_types=1);

use Bga\Games\dojoless\Tests\Stubs\GameUT;
use PHPUnit\Framework\TestCase;

final class GameTest extends TestCase {
    private GameUT $game;

    protected function setUp(): void {
        $this->game = new GameUT();
    }

    public function testGetGameProgression(): void {
        $this->assertEquals(0, $this->game->getGameProgression());
    }

    public function testIsEndOfGame(): void {
        $this->assertFalse($this->game->isEndOfGame());
    }
}
