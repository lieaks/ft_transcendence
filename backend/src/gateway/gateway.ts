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
import { IChatUser, userChatRole } from '../interfaces/user.interface';

function getShortChannels(channels: IChat[]) {
  return channels.map((c) => {
    return {
      id: c.id,
      name: c.name,
      type: c.type,
    };
  });
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
        // console.log('disconnected because of ' + reason);
        const user = this.usersService.getUserBySocketId(socket.id);
        if (!user) return;
        this.gamesService.removeFromQueue(user);
        const emptyChannels = this.chatService.removeUserFromChannels(user);
        for (const channel of emptyChannels) {
          this.server.emit('channelDeleted', {
            channelId: channel.id,
          });
        }
        this.usersService.removeUser(user.id);
        this.connectedSockets.delete(socket);
        // console.log(
        //   'disconnected from socket with id:' + this.connectedSockets.size,
        // );
      });
      this.connectedSockets.set(socket, this.connectedSockets.size + 1);
      // console.log('connected to socket with id:' + this.connectedSockets.size);
    });
  }

  @SubscribeMessage('login')
  async onLogin(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const { jwtToken } = body;
    try {
      if (!jwtToken) throw 'no jwttoken provided';
      const payload = this.JwtService.verify(jwtToken);
      if (this.AuthService.isTokenRequireTwoFactor(jwtToken))
        throw '2FA needed for this jwttoken';
      const user = new User(this.prismaService, payload.id, payload.name);
      if (!user) throw 'invalid jwttoken';

      user.socket = client;
      user.status = Status.ONLINE;
      await this.usersService.addUser(user);
      client.emit('logged', 'success');
      this.onChannelAvailable({}, client);
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
    // console.log('Added to queue');
  }

  @SubscribeMessage('leaveQueue')
  onLeaveQueue(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.gamesService.removeFromQueue(
      this.usersService.getUserBySocketId(client.id),
    );
    // console.log('Removed from queue');
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
    const chatRoom = this.chatService.getChat(channelId);
    if (!chatRoom) return;
    chatRoom.addMessage({ sender: user, content, createdAt: new Date() });
  }

  @SubscribeMessage('createChannel')
  onCreateChannel(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    if (!body.name) return;
    const user = this.usersService.getUserBySocketId(client.id);
    if (!user) return;
    const chatUser: IChatUser = {
      ...user,
      role: userChatRole.CREATOR,
    };
    const newChannel = this.chatService.createChat(body.name, chatType.PUBLIC);
    if (!newChannel) return;
    this.server.emit('newChannel', getShortChannels([newChannel])[0]);
    newChannel.addUser(chatUser);
  }

  @SubscribeMessage('joinChannel')
  onJoinChannel(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const user = this.usersService.getUserBySocketId(client.id);
    const chat = this.chatService.getChat(body.id);
    if (!chat || !user) return;
    if (chat.type == chatType.PRIVATE) return;
    const password = body.password;
    const chatUser: IChatUser = {
      ...user,
      role: userChatRole.MEMBER,
    };
    if (chat.type === chatType.PROTECTED) {
      if (!password) return;
      chat.addUser(chatUser, password);
    } else chat.addUser(chatUser);
  }

  @SubscribeMessage('channelAvailable')
  onChannelAvailable(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const listChannel = this.chatService.getChats();
    if (!listChannel) return;
    for (let i = 0; i < listChannel.length; i++) {
      if (listChannel[i].type == chatType.PRIVATE) {
        const user = this.usersService.getUserBySocketId(client.id);
        if (!user || !listChannel[i].getUserById(user.id)) {
          listChannel.splice(i, 1);
        }
      }
    }
    client.emit('channelAvailable', getShortChannels(listChannel));
  }

  @SubscribeMessage('inviteToGame')
  onInviteToGame(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const invitedId = body.id;
    const user = this.usersService.getUserBySocketId(client.id);
    const invited = this.usersService.getUser(invitedId);
    if (!user || !invited) return;
    invited.socket.emit('gameInvite', { name: user.name, id: user.id });
  }

  @SubscribeMessage('acceptInvite')
  onAcceptInvite(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const user = this.usersService.getUserBySocketId(client.id);
    const invited = this.usersService.getUser(body.id);

    if (
      !user ||
      !invited ||
      user.status == Status.INGAME ||
      invited.status == Status.INGAME
    )
      return;
    this.gamesService.createCustomGame(user, invited);

    if (this.gamesService.getQueue().includes(user))
      this.gamesService.removeFromQueue(user);
    if (this.gamesService.getQueue().includes(invited))
      this.gamesService.removeFromQueue(invited);
  }

  @SubscribeMessage('spectateGame')
  onSpectateGame(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const user = this.usersService.getUserBySocketId(client.id);
    const player = this.usersService.getUser(body.id);
    if (!user || !player) return;
    const game = this.gamesService
      .getGames()
      .find((game) => game.players.includes(player));
    if (game) return;
    game.addSpectator(user);
    user.socket.emit('spectateGame', {});
  }

  @SubscribeMessage('updateUser')
  onUpdateUser(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const { id: playerID, channelID, action, time } = body;

    if (!playerID || !channelID || !action) return;
    const chat = this.chatService.getChat(channelID);
    if (!chat) return;
    const sender = chat.getUserById(
      this.usersService.getUserBySocketId(client.id).id,
    );
    const player = chat.getUserById(playerID);
    if (!sender || !player) return;
    if ((action == 'mute' || action == 'ban') && !time) return;
    let ret = false;
    switch (action) {
      case 'mute':
        ret = chat.muteUser(player, sender, time);
        break;
      case 'unmute':
        ret = chat.unmuteUser(player, sender);
        break;
      case 'ban':
        ret = chat.banUser(player, sender, time);
        break;
      case 'kick':
        ret = chat.kickUser(player, sender);
        break;
      case 'op':
        ret = chat.opUser(player, sender);
        break;
      case 'deop':
        ret = chat.deopUser(player, sender);
        break;
      default:
        break;
    }
    if (!ret) client.emit('permissionDenied', {});
  }

  @SubscribeMessage('changePassword')
  onChangePassword(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const password = body.password;
    const channelID = body.id;
    if ((!password && password !== '') || !channelID) return;
    const chat = this.chatService.getChat(body.id);
    if (!chat) return;
    const user = chat.getUserById(
      this.usersService.getUserBySocketId(client.id).id,
    );
    if (!user) return;
    if (chat.changePassword(user, password)) {
      this.server.emit('channelInfo', { channelId: chat.id, type: chat.type });
    } else {
      client.emit('permissionDenied', {});
    }
  }

  @SubscribeMessage('createPrivateChat')
  onCreatePrivateChannel(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.usersService.getUserBySocketId(client.id);
    const invited = this.usersService.getUser(body.id);
    if (!user || !invited) return;
    this.chatService.createPrivateChat(user, invited);
  }

  @SubscribeMessage('deleteChannel')
  onDeleteChannel(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const chat = this.chatService.getChat(body.id);
    if (!chat) return;
    const user = chat.getUserById(
      this.usersService.getUserBySocketId(client.id).id,
    );
    if (!user) return;
    if (!chat.deleteChannel(user)) client.emit('permissionDenied', {});
    else {
      this.server.emit('channelDeleted', {
        channelId: chat.id,
      });
    }
  }

  @SubscribeMessage('leaveChannel')
  onLeaveChannel(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const chat = this.chatService.getChat(body.id);
    if (!chat) return;
    const user = chat.getUserById(
      this.usersService.getUserBySocketId(client.id).id,
    );
    if (!user) return;
    if (chat.removeUser(user)) {
      this.server.emit('channelDeleted', {
        channelId: chat.id,
      });
    }
  }
}
