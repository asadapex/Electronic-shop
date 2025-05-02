import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Request } from 'express';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthguardGuard } from 'src/authguard/authguard.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthguardGuard)
  @Post()
  create(@Body() createChatDto: CreateChatDto, @Req() req: Request) {
    return this.chatService.create(createChatDto, req);
  }

  @UseGuards(AuthguardGuard)
  @Post('message')
  createMessage(@Body() data: CreateMessageDto, @Req() req: Request) {
    return this.chatService.createMessage(data, req);
  }
}
