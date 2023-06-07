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
			console.log(socket.id);
			
			this.connectedSockets.set(this.connectedSockets.size + 1, socket);
			console.log('connected to socket with id:' + this.connectedSockets.size);
		});
	}

	@SubscribeMessage('hello')
	onHello(@MessageBody() body: any) {
		console.log(body);
		this.server.emit('onHello', {
			message: 'Hello from server',
			content: body,
		})
	}

	@SubscribeMessage('msgToUser')
    onMsgToUser(@MessageBody() body: any) {
        // console.log(body);
        const { userId, message } = body;
		console.log("userId: " + userId + " message: " + message);
        const socket = this.connectedSockets.get(userId);
        if (socket) {
			console.log("socket found");
            socket.emit('msgToUser', {
                message: message,
            });
        } else  {
			console.log("socket not found");
		}
    }
}
