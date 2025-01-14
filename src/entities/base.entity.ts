import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column()
	name: string;

	@Column()
	password: string;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	updatedAt: Date;
}
