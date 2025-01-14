import { Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TeacherStudent } from './teacher-student.entity';

@Entity()
export class Teacher extends BaseEntity {
	@OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.student)
	teacherStudents: TeacherStudent[];
}
