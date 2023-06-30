export class CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export type favoriteHeros = {
  id: string;
  external_id: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type GetUsersByIdDto = {
  user: {
    id: string;
    username: string;
    email: string;
  };
  favoriteHeros: favoriteHeros[];
};
