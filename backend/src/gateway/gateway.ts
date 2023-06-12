import { OnModuleInit } from '@nestjs/common';
import {
MessageBody,
SubscribeMessage,
WebSocketGateway,
WebSocketServer,
ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user';

@WebSocketGateway({ cors: true })
export class MyGateway implements OnModuleInit {
	constructor(
		private readonly UsersService: UsersService,
	) {}

	@WebSocketServer()
	server: Server;

	private connectedSockets: Map<Socket, number> = new Map<Socket, number>();

	onModuleInit() {
		this.server.on('connection', (socket) => {
		socket.on('disconnect', () => {
			this.connectedSockets.delete(socket);
			console.log(
			'disconnected from socket with id:' + this.connectedSockets.size,
			);
		});
		this.connectedSockets.set(socket, this.connectedSockets.size + 1);
		console.log('connected to socket with id:' + this.connectedSockets.size);
		});
	}

	// addUser function, to add a new user to the users array in the UsersService, take id as parameter
	@SubscribeMessage('login')
	onAddUser(@MessageBody() body: any) {
		const { id } = body;
		let user = new User(this.UsersService.prismaService, id);
		console.log('Message received from addUser: id: ' + id);
		this.UsersService.addUser(user);
	}

	@SubscribeMessage('movePaddle')
	onMovePaddle(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		const { direction } = body;
		let player = '';

		if (this.connectedSockets.get(client) === 1) {
		player = 'left';
		} else if (this.connectedSockets.get(client) === 2) {
		player = 'right';
		}
		if (player === '') {
		return;
		}
		console.log(
		'Message received from movePaddle: player: ' +
			player +
			' direction: ' +
			direction,
		);
		this.server.emit('movePaddle', { player: player, direction: direction });
	}
}
