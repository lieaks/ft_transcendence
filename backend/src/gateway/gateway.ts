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
import { Status } from '../interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { GamesService } from 'src/games/games.service';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chats.service';
import { chatType, IChat } from 'src/interfaces/chat.interface';

function getShortChannels(channels: IChat[]) {
	return channels.map(c => {
		return {
			id: c.id,
			name: c.name,
			type: c.type,
		}
	})
}

@WebSocketGateway({ cors: true })
export class MyGateway implements OnModuleInit {
	constructor(
		private readonly usersService: UsersService,
		private readonly gamesService: GamesService,
		private readonly JwtService: JwtService,
		private readonly prismaService: PrismaService,
		private readonly AuthService: AuthService,
		private readonly chatService: ChatService,
	) {}

	@WebSocketServer()
	server: Server;

	private connectedSockets: Map<Socket, number> = new Map<Socket, number>();

	onModuleInit() {
		this.server.on('connection', (socket) => {
			socket.on('disconnect', (reason) => {
				console.log('disconnected because of ' + reason);
				const user = this.usersService.getUserBySocketId(socket.id);
				if (!user) return;
				this.gamesService.removeFromQueue(user)
				this.chatService.removeUserFromChannels(user)
				this.usersService.removeUser(user.id)
				this.connectedSockets.delete(socket);
				console.log(
					'disconnected from socket with id:' + this.connectedSockets.size,
				);
			});
			this.connectedSockets.set(socket, this.connectedSockets.size + 1);
			console.log('connected to socket with id:' + this.connectedSockets.size);
		});
	}

	@SubscribeMessage('login')
	onLogin(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		const { jwtToken } = body;
		try {
			if (!jwtToken) throw 'no jwttoken provided';
			const payload = this.JwtService.verify(jwtToken)
			if (this.AuthService.isTokenRequireTwoFactor(jwtToken))
			throw '2FA needed for this jwttoken';
			const user = new User(this.prismaService, payload.id, payload.name);
			if (!user) throw 'invalid jwttoken';

			user.socket = client;
			user.status = Status.ONLINE;
			this.usersService.addUser(user);
			client.emit('logged', 'success');
		} catch (error) {
			console.error('login failure:', error);
			client.emit('logged', error);
		}
	}

	@SubscribeMessage('joinQueue')
	onJoinQueue(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		if (
			this.gamesService.addToQueue(
				this.usersService.getUserBySocketId(client.id),
			)
		) {
			client.emit('joinQueue', {});
		}
		console.log('Added to queue');
	}

	@SubscribeMessage('leaveQueue')
	onLeaveQueue(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		this.gamesService.removeFromQueue(
			this.usersService.getUserBySocketId(client.id),
		);
		console.log('Removed from queue');
	}

	@SubscribeMessage('movePaddle')
	onMovePaddle(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		const { direction, gameId } = body;
		const user = this.usersService.getUserBySocketId(client.id);
		if (!user) return;
		const game = this.gamesService.getGame(gameId);
		if (!game) return;
		game.movePaddle(user, direction);
	}

	@SubscribeMessage('sendMessage')
	onSendMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		const { content, channelId } = body;
		const user = this.usersService.getUserBySocketId(client.id);
		if (!content || !channelId || !user) return;
		let chatRoom = this.chatService.getChat(channelId);
		if (!chatRoom) return;
		chatRoom.addMessage({sender: user, content, createdAt: new Date()});
	}

	@SubscribeMessage('createChannel')
	onCreateChannel(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		if (!body.name) return
		const newChannel = this.chatService.createChat(body.name, chatType.PUBLIC)
		this.server.emit('newChannel', getShortChannels([newChannel])[0])
	}

	@SubscribeMessage('joinChannel')
	onJoinChannel(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		const user = this.usersService.getUserBySocketId(client.id)
		const chat = this.chatService.getChat(body.id)
		if (!chat || !user) return
		chat.addUser(user)
	}

	@SubscribeMessage('channelAvailable')
	onChannelAvailable(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
		const listChannel = this.chatService.getChats();
		this.server.emit('channelAvailable', getShortChannels(listChannel))
	}
}
