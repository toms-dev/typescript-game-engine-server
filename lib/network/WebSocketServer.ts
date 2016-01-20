
import websocket = require('websocket');
import http = require('http');

import GameServer from "../GameServer";
import Client from "../Client";

export default class WebSocketServer {

	constructor() {
	}

	start(onNewClientCallback: (connection: websocket.connection) => void):void {
		var WebSocketServer = websocket.server;

		var server = http.createServer((request: http.ServerRequest, response: http.ServerResponse) => {
			console.log((new Date()) + ' Received request for ' + request.url);
			response.writeHead(404);
			response.end();
		});
		server.listen(8080, function () {
			console.log((new Date()) + ' Server is listening on port 8080');
		});

		var wsServer = new WebSocketServer({
			httpServer: server,
			// You should not use autoAcceptConnections for production
			// applications, as it defeats all standard cross-origin protection
			// facilities built into the protocol and the browser.  You should
			// *always* verify the connection's origin and decide whether or not
			// to accept it.
			autoAcceptConnections: false
		});

		function originIsAllowed(origin: string) {
			// put logic here to detect whether the specified origin is allowed.
			return true;
		}

		wsServer.on('request', (request) => {
			if (!originIsAllowed(request.origin)) {
				// Make sure we only accept requests from an allowed origin
				request.reject();
				console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
				return;
			}

			var connection = request.accept(null, request.origin);
			console.log((new Date()) + ' Connection accepted.');


			//var client = new Client(this.gameServer, connection);
			//this.gameServer.addClient(client);
			onNewClientCallback(connection);
		});
	}

}
