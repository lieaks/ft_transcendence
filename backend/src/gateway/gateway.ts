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
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { GamesService } from 'src/games/games.service';

@WebSocketGateway({ cors: true })
export class MyGateway implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly gamesService: GamesService,
    private readonly JwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  @WebSocketServer()
  server: Server;

  private connectedSockets: Map<Socket, number> = new Map<Socket, number>();

  onModuleInit() {
    this.server.on('connection', (socket) => {
      socket.on('disconnect', () => {
        this.usersService.removeUserBySocket(socket);
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
      const payload = this.JwtService.verify(jwtToken);
      const user = new User(this.prismaService, payload.sub);
      this.usersService.addUser(user);
      this.usersService.setSocket(payload.sub, client);
    } catch (error) {
      console.error('onAddUser:', error);
    }
  }

  @SubscribeMessage('joinQueue')
  onJoinQueue(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.gamesService.addToQueue(
      this.usersService.getUserBySocketId(client.id),
    );
  }

  @SubscribeMessage('movePaddle')
  onMovePaddle(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const { direction } = body;
    let user = this.usersService.getUserBySocketId(client.id);
    if (!user) return;
    this.gamesService.getGames()[0].movePaddle(user, direction);
  }
}
