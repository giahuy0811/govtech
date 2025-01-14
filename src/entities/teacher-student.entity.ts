import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';

@Entity()
export class TeacherStudent {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Teacher, (teacher) => teacher.teacherStudents)
	@JoinColumn({ name: 'teacher_id' })
	teacher: Teacher;

	@ManyToOne(() => Student, (student) => student.teacherStudents)
	@JoinColumn({ name: 'student_id' })
	student: Student;
}
