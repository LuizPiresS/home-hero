export const USER_ROLES = ['contratante', 'profissional'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  roles: UserRole[];
  emailVerifiedAt: Date | null;
  verificationTokenHash: string | null;
  verificationTokenExpiresAt: Date | null;
  createdAt: Date;
};

export const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && USER_ROLES.includes(value as UserRole);

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();
