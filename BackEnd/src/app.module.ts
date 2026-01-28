import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ItemsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
