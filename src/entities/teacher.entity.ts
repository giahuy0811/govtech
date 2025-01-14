import { Entity, ManyToMany } from 'typeorm';
import { Student } from './student.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Teacher extends BaseEntity {
	@ManyToMany(() => Student, (student) => student.teachers)
	students: Student[];
}
