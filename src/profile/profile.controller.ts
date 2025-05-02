import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthguardGuard } from 'src/authguard/authguard.guard';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthguardGuard)
  @Get('my-orders')
  findMyOrder(@Req() req: Request) {
    return this.profileService.findMyOrder(req);
  }

  @UseGuards(AuthguardGuard)
  @Get('my-likes')
  findMyLikes(@Req() req: Request) {
    return this.profileService.findMyLikes(req);
  }

  @UseGuards(AuthguardGuard)
  @Get('last-viewed')
  findMyLastViewed(@Req() req: Request) {
    return this.profileService.findMyLastViewed(req);
  }

  @UseGuards(AuthguardGuard)
  @Get('my-posts')
  findMyPosts(@Req() req: Request) {
    return this.profileService.findMyPosts(req);
  }

  @UseGuards(AuthguardGuard)
  @Get('my-chats')
  findMyChats(@Req() req: Request) {
    return this.profileService.findMyChats(req);
  }
}
