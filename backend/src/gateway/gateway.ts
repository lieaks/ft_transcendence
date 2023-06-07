import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: true })
export class MyGateway implements OnModuleInit {

	@WebSocketServer()
	server: Server;

	private connectedSockets: Map<Socket, number> = new Map<Socket, number>();

	onModuleInit() {
		this.server.on('connection', (socket) => {
			this.connectedSockets.set(socket, this.connectedSockets.size + 1);
			console.log('connected to socket with id:' + this.connectedSockets.size);
		});
	}

	@SubscribeMessage('movePaddle')
	onMovePaddle(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		const { direction } = body;
		let player = "";

		if (this.connectedSockets.get(client) === 1) {
			player = "left";
		} else if (this.connectedSockets.get(client) === 2) {
			player = "right";
		}
		if (player === "") {
			return;
		}
		console.log("Message received from movePaddle: player: " + player + " direction: " + direction);
		this.server.emit('movePaddle', { player: player, direction: direction });
	}

	// @SubscribeMessage('hello')
	// onHello(@MessageBody() body: any) {
	// 	console.log("Message received from Hello: " + body);
	// 	this.server.emit('onHello', {
	// 		message: 'Hello from server',
	// 		content: body,
	// 	})
	// }

	// @SubscribeMessage('msgToUser')
    // onMsgToUser(@MessageBody() body: any) {
    //     const { userId, message } = body;
	// 	console.log("Message received from msgToUser: userId: " + userId + " message: " + message);
    //     const socket = this.connectedSockets.get(userId);
    //     if (socket) {
    //         socket.emit('msgToUser', {
    //             message: message,
    //         });
	// 	}
    // }
}
