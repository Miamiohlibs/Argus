import { UserAffiliation } from '@prisma/client';

export function isUserAffiliation(
  value: string | string[] | undefined
): value is UserAffiliation {
  return (
    typeof value === 'string' &&
    (Object.values(UserAffiliation) as string[]).includes(value)
  );
}

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

export type AllowedAffiliation = 'Miami' | 'Other' | undefined;

export function isAllowedAffiliation(
  value: string | undefined
): value is AllowedAffiliation {
  return ['Miami', 'Other', undefined].includes(value);
}
