import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway()
export class MyGateway {
	@SubscribeMessage('hello')
	onHello(@MessageBody() body: any) {
		console.log(body);
	}
}
