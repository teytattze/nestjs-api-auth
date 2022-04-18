import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [AuthenticationModule, PrismaModule],
})
export class AppModule {}
