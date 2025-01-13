import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { ROLE } from '../constants';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column({ type: 'enum', enum: ROLE })
	role: ROLE;

	@Column({ default: null })
	refreshToken: string;

	@Column({ default: false })
	suspended: boolean;

	@ManyToMany(() => User, (user) => user.students)
	@JoinTable({
		name: 'teacher_students',
		joinColumn: {
			name: 'teacherId',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'studentId',
			referencedColumnName: 'id',
		},
	})
	students: User[];

	@ManyToMany(() => User, (user) => user.teachers)
	teachers: User[];
}
