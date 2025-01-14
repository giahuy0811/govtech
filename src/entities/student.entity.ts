import { Entity, ManyToMany, JoinTable, Column, OneToMany } from 'typeorm';
import { Teacher } from './teacher.entity';
import { BaseEntity } from './base.entity';
import { TeacherStudent } from './teacher-student.entity';

@Entity()
export class Student extends BaseEntity {
	@Column({ type: 'boolean', default: false })
	suspended: boolean;

	@OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.student)
	teacherStudents: TeacherStudent[];
}
