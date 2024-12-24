import { Get, Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessagesService {
    constructor(private readonly prisma: PrismaService) {}

    async getMessages(phoneNumber: string) {
        
        if (phoneNumber.trim().length != 12 && phoneNumber[0] != '+') {

            phoneNumber = '+' + phoneNumber.trim();
        }
        const user = await this.prisma.user.findUnique({
            where: {
                phoneNumber: phoneNumber
            }
        });

        if (!user || user === null) {
            return {
                error: 'User not found'
            }
        }

        const chatMessages = await this.prisma.chatMessage.findMany({
            where: {
                OR: [
                    { senderId: user.id },
                    { receiverId: user.id },
                ],
            },
            include: {
                sender: true,
                receiver: true,
            },
        });

        const userIds = new Set<number>();
        chatMessages.forEach((message) => {
            if (message.sender.id !== user.id) userIds.add(message.sender.id);
            if (message.receiver.id !== user.id) userIds.add(message.receiver.id);
        });

        const usersWithChats = await this.prisma.user.findMany({
            where: {
                id: {
                    in: Array.from(userIds)
                }
            }
        });

        return {
            user: user,
            usersWithChats: usersWithChats,
            // chatMessages: chatMessages
        };

    }

    async getMessagesChat(senderId: number, receiverId: number) {
        const chatMessages = await this.prisma.chatMessage.findMany({
            where: {
                senderId: senderId, // Фильтруем по отправителю
                receiverId: receiverId, // Фильтруем по получателю
            },
            select: {
                messageText: true,  // Текст сообщения
                sentAt: true,       // Время отправки
                attachmentUrl: true, // Ссылка на вложение (если есть)
                sender: {
                    select: {
                        name: true, // Имя отправителя
                        avatarUrl: true, // Аватар отправителя (если нужно)
                    },
                },
                receiver: {
                    select: {
                        name: true, // Имя получателя
                        avatarUrl: true, // Аватар получателя (если нужно)
                    },
                },
            },
            orderBy: {
                sentAt: 'asc', // Сортировка сообщений по времени (по возрастанию)
            },
        });
    
        return chatMessages;
    }
    

}
