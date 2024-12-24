import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ChatMessage } from '../../messages/entities/chat-message.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    phoneNumber: string;

    @OneToMany(() => ChatMessage, chatMessage => chatMessage.sender)
    messagesSent: ChatMessage[];

    @OneToMany(() => ChatMessage, chatMessage => chatMessage.receiver)
    messagesReceived: ChatMessage[];
}
