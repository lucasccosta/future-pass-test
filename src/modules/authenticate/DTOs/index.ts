export interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export class AuthenticateDto {
  email: string;
  password: string;
}
