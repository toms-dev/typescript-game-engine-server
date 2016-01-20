
import {Game} from "../../../../client/index";
import My2DRenderer from "./game/My2DRenderer";
import MyTextRenderer from "./game/MyTextRenderer";
import ColorButton from "./game/ColorButton";


var game = new Game();
game.start();
var commandSender = game.commandSender;

(<any> window).game = game;

// Setup renderers
//
// Create 2D renderer
var my2DRenderer = new My2DRenderer(game);
// TODO: Bind it to the canvas

// Create text renderer
var myTextRenderer = new MyTextRenderer(game);


// Bind them to the game
game.addComponent(my2DRenderer);
game.addComponent(myTextRenderer);

var button = new ColorButton(commandSender);