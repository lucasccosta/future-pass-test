export interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export class JWTStrategyDto {
  email: string;
  password: string;
}

export type JWTStrategyResponse = {
  access_token: string;
  userId: string;
};
