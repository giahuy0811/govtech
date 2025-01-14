import { Entity, ManyToMany, JoinTable, Column } from 'typeorm';
import { Teacher } from './teacher.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Student extends BaseEntity {
	@Column({ type: 'boolean', default: false })
	suspended: boolean;

	@ManyToMany(() => Teacher, (teacher) => teacher.students)
	@JoinTable()
	teachers: Teacher[];
}
