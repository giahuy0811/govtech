import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TeacherStudent } from './teacher-student.entity';

@Entity()
export class Student extends BaseEntity {
	@Column({ type: 'boolean', default: false })
	suspended: boolean;

	@OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.student)
	teacherStudents: TeacherStudent[];
}
