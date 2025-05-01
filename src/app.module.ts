import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailerService } from './mailer/mailer.service';
import { RegionModule } from './region/region.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, RegionModule, ProductModule],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
