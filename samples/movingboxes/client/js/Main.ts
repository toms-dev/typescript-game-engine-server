
import {Game} from "../../../../client/index";
import MyRenderer from "./game/MyRenderer";

var game = new Game();
game.start();

(<any> window).game = game;

// Setup renderer
//
// Create 2D renderer
var myRenderer = new MyRenderer(game);

// Bind it to the canvas

// Bind it to the game
game.addComponent(myRenderer);