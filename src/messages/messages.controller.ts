import { Body, Controller, Get, Param, Post, Query,  } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

    @Get('/')
    async getMessages(@Query('phoneNumber') phoneNumber: string) {
        if (!phoneNumber) {
            throw new Error('Phone number is required');
        }
    
        return this.messagesService.getMessages(phoneNumber);
    }

    @Get('/chat/')
    async getMessagesChat(@Query('senderId') senderId: string, @Query('receiverId') receiverId: string) {
        // if (!chatId) {
        //     throw new Error('Chat id is required');
        // }
        console.log(senderId, receiverId);
    
        const senderIdNumber = parseInt(senderId, 10);
        const receiverIdNumber = parseInt(receiverId, 10);

        if (isNaN(senderIdNumber) || isNaN(receiverIdNumber)) {
            throw new Error('Invalid senderId or receiverId');
        }

        return this.messagesService.getMessagesChat(senderIdNumber, receiverIdNumber);
    }
}
