import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: true })
export class MyGateway implements OnModuleInit {

	@WebSocketServer()
	server: Server;

	private connectedSockets: Map<number, Socket> = new Map<number, Socket>();

	onModuleInit() {
		this.server.on('connection', (socket) => {
			this.connectedSockets.set(this.connectedSockets.size + 1, socket);
			console.log('connected to socket with id:' + this.connectedSockets.size);
		});
	}

	@SubscribeMessage('movePaddle')
	onMovePaddle(@MessageBody() body: any) {
		const { direction } = body;
		console.log(`Message received from movePaddle: ${direction}`);
		this.server.emit('movePaddle', {direction: direction});
	}

	@SubscribeMessage('hello')
	onHello(@MessageBody() body: any) {
		console.log("Message received from Hello: " + body);
		this.server.emit('onHello', {
			message: 'Hello from server',
			content: body,
		})
	}

	@SubscribeMessage('msgToUser')
    onMsgToUser(@MessageBody() body: any) {
        const { userId, message } = body;
		console.log("Message received from msgToUser: userId: " + userId + " message: " + message);
        const socket = this.connectedSockets.get(userId);
        if (socket) {
            socket.emit('msgToUser', {
                message: message,
            });
		}
    }
}
