import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChatDto: CreateChatDto, req: Request) {
    try {
      const chat = await this.prisma.chat.findFirst({
        where: {
          fromUser: { id: req['user-id'] },
          toUser: { id: createChatDto.toUser },
        },
      });
      if (chat) {
        throw new BadRequestException({ message: 'Chat already exists' });
      }
      const newChat = await this.prisma.chat.create({
        data: {
          ...createChatDto,
          fromUser: { connect: { id: req['user-id'] } },
          toUser: { connect: { id: createChatDto.toUser } },
        },
      });

      return newChat;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }

  async createMessage(data: CreateMessageDto, req: Request) {
    try {
      const newMessage = await this.prisma.chatMessage.create({
        data: { ...data, fromId: req['user-id'] },
      });
      return newMessage;
    } catch (error) {
      if (error != InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Something went wrong',
      });
    }
  }
}
