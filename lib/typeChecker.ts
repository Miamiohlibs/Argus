// import { UserStatus } from '@prisma/client';

export type AllowedUserStatus =
  | 'Undergrad'
  | 'Graduate'
  | 'Faculty'
  | 'Staff'
  | 'Alumni'
  | 'Other'
  | undefined;

export function isAllowedUserStatus(
  value: string | undefined
): value is AllowedUserStatus {
  return [
    'Undergrad',
    'Graduate',
    'Faculty',
    'Staff',
    'Alumni',
    'Other',
    undefined,
  ].includes(value);
}
