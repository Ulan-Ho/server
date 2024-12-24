import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ChatMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.messagesSent)
    sender: User;

    @ManyToOne(() => User, user => user.messagesReceived)
    receiver: User;

    @Column()
    messageText: string;

    @Column({ nullable: true })
    attachmentUrl: string;

    @Column()
    sentAt: Date;
}
