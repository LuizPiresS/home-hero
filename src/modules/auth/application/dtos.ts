import type { UserRole } from '../domain/user.js';

// DTOs compartilhados entre os adaptadores HTTP e os casos de uso.
// Os campos de entrada permanecem desconhecidos até a validação do schema.
export type RegisterUserInputDto = {
  email: unknown;
  password: unknown;
  roles: unknown;
};

export type RegisterUserOutputDto = {
  id: string;
  email: string;
  roles: UserRole[];
  emailVerified: false;
};

export type VerifyEmailInputDto = {
  token?: unknown;
};

export type VerifyEmailOutputDto = {
  email: string;
  emailVerified: true;
};

export type LoginUserInputDto = {
  email: unknown;
  password: unknown;
};

export type LoginUserOutputDto = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    roles: UserRole[];
  };
};
