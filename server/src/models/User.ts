import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  firstname: string;

  @Field(() => String)
  @Column()
  lastname: string;

  @Field(() => String)
  @Column()
  nickname: string;

  @Field(() => String)
  @Column()
  email: string;

  @Column()
  password: string;
}