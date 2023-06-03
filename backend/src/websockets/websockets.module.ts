import { Module } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketsGateway {
  @WebSocketServer()
  server: Server;
}

@Module({
  providers: [WebsocketsGateway],
})
export class WebsocketsModule {}
