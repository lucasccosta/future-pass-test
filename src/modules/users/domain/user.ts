import { UnprocessableEntityException } from '@nestjs/common';
import { heros } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export type UserDomainDTO = {
  id?: string;
  username: string;
  email: string;
  password: string;
  heros?: heros[];
};

class UserDomain {
  private _id: string;
  private _username: string;
  private _email: string;
  private _password: string;
  private _heros: heros[];

  constructor({ id, username, email, password, heros }: UserDomainDTO) {
    this._id = id;
    this._username = username;
    this._email = email;
    this._password = password;
    this._heros = heros;
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  get email(): string {
    return this._email;
  }
  get password(): string {
    return this._password;
  }

  get heros(): heros[] {
    return this._heros;
  }

  getHero(external_id: number) {
    return this.heros.find((hero) => hero.external_id === external_id);
  }

  encryptPassword() {
    this._password = bcrypt.hashSync(this.password, 8);
  }

  validate() {
    if (this.username.length == 0) {
      throw new UnprocessableEntityException('Please insert a valid username');
    }
    if (this.email.length == 0) {
      throw new UnprocessableEntityException('Please insert a valid email');
    }
    if (this.password.length < 8) {
      throw new UnprocessableEntityException(
        'Please insert a password with at least 8 characters',
      );
    }
  }
}

export { UserDomain };
