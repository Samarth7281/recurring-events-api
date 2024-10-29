import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  label: string;
  
  @Column()
  value: string;
}

@Entity()
export class CustomColumn{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;
  
  @Column('text',{array: true,default: [] })
  value: string[];
}
