import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailerService } from './mailer/mailer.service';
import { RegionModule } from './region/region.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { ColorModule } from './color/color.module';
import { OrderModule } from './order/order.module';
import { ProfileModule } from './profile/profile.module';
import { MulterModule } from './multer/multer.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ChatModule } from './chat/chat.module';
import { AdminModule } from './admin/admin.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    RegionModule,
    ProductModule,
    CategoryModule,
    CommentModule,
    ColorModule,
    OrderModule,
    ProfileModule,
    MulterModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file',
    }),
    ChatModule,
    AdminModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
