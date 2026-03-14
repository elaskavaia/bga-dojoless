import { expect } from "chai";
import { Game } from "../Game";

// Minimal Bga stub for testing
const bgaStub: any = {
  gameArea: { getElement: () => document.createElement("div") },
  statusBar: { addActionButton: () => {} },
  actions: { performAction: () => {} },
  notifications: { setupPromiseNotifications: () => {} },
  players: { isCurrentPlayerSpectator: () => false },
  states: { register: () => {} }
};

describe("Game", () => {
  it("should instantiate", () => {
    const game = new Game(bgaStub);
    expect(game).to.be.instanceOf(Game);
  });

  it("should have custom module", () => {
    const game = new Game(bgaStub);
    expect(game.custom).to.exist;
  });
});
