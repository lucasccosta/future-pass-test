import { Column, Model, Table } from 'sequelize-typescript';
import { v4 as uuid } from 'uuid';

@Table
export class User extends Model {
  @Column({
    defaultValue: uuid,
    primaryKey: true,
  })
  id: string;

  @Column({
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column({
    allowNull: false,
    defaultValue: Date.now(),
  })
  createdAt: Date;

  @Column({ allowNull: true })
  updatedAt?: Date;

  // @HasMany(() => FavoriteCharacters)
  // favoriteCharacters: FavoriteCharacterso[];
}
