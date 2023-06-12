import { Module, forwardRef } from '@nestjs/common';
import { MyGateway } from './gateway';
import { AppModule } from 'src/app.module';

@Module({
imports: [forwardRef(() => AppModule)],
  providers: [MyGateway],
})
export class GatewayModule {}
