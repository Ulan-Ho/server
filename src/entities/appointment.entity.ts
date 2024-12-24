import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('appointment')
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    clinicAddress: string;

    @Column()
    appointmentDate: Date;

    @Column()
    status: string;

    @ManyToOne(() => User, (user) => user.appointments)
    user: User;
}
