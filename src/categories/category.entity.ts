import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    name: 'parent_id',
    type: 'bigint',
    nullable: true,
  })
  parentId: number | null;
}
