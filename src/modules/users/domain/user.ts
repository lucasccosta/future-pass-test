import { UnprocessableEntityException } from '@nestjs/common';

export type UserDomainDTO = {
  id?: string;
  username: string;
  email: string;
  password: string;
};

class UserDomain {
  private _id: string;
  private _username: string;
  private _email: string;
  private _password: string;

  constructor({ id, username, email, password }: UserDomainDTO) {
    this._id = id;
    this._username = username;
    this._email = email;
    this._password = password;
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
