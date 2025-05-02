import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Request } from 'express';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto, req: Request) {
    return this.chatService.create(createChatDto, req);
  }

  @Post('message')
  createMessage(@Body() data: CreateMessageDto, req: Request) {
    return this.chatService.createMessage(data, req);
  }
}
