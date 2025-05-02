import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
      const touser = await this.prisma.user.findUnique({
        where: { id: createChatDto.toUser },
      });
      if (!touser) {
        throw new NotFoundException({ message: 'User not found' });
      }
      const chat = await this.prisma.chat.findFirst({
        where: {
          fromUser: { id: req['user-id'] },
          toUser: { id: createChatDto.toUser },
        },
      });
      if (chat) {
        throw new BadRequestException({ message: 'Chat already exists' });
      }
      const fromUserId = req['user-id'];
      const toUserId = createChatDto.toUser;

      console.log(fromUserId, toUserId, 1111);

      if (!fromUserId || !toUserId) {
        throw new BadRequestException('fromUserId or toUserId is missing');
      }

      const newChat = await this.prisma.chat.create({
        data: {
          fromUser: {
            connect: { id: fromUserId },
          },
          toUser: {
            connect: { id: toUserId },
          },
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
      const chat = await this.prisma.chat.findUnique({
        where: { id: data.chatId },
      });
      if (!chat) {
        throw new NotFoundException({ message: 'Chat not found' });
      }
      const touser = await this.prisma.user.findUnique({
        where: { id: data.toId },
      });
      if (!touser) {
        throw new NotFoundException({ message: 'User not found' });
      }
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
