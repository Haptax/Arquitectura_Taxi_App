import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('drivers')
export class DriverOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'float', default: 5 })
  rating: number;

  @Column({ type: 'float' })
  currentLat: number;

  @Column({ type: 'float' })
  currentLng: number;

  @Column({ default: true })
  isAvailable: boolean;
}
