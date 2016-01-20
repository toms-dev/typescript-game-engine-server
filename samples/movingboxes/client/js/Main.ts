
import {Game} from "../../../../client/index";
import My2DRenderer from "./game/My2DRenderer";
import MyTextRenderer from "./game/MyTextRenderer";


var game = new Game();
game.start();

(<any> window).game = game;

// Setup renderers
//
// Create 2D renderer
var my2DRenderer = new My2DRenderer(game);
// TODO: Bind it to the canvas

// Create text renderer
var myTextRenderer = new MyTextRenderer(game);


// Bind it to the game
game.addComponent(my2DRenderer);
game.addComponent(myTextRenderer);