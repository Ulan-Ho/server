import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Appointment } from './appointment.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    phoneNumber: string;

    @Column()
    role: string;

    @Column()
    encryptedPassword: string;

    @OneToMany(() => Appointment, (appointment) => appointment.user)
    appointments: Appointment[];
}
