import { getUserAffiliations } from '@/lib/utils';

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

export function isAllowedAffiliation(
  value: string | string[] | undefined
): value is string | undefined {
  return (
    value === undefined ||
    (typeof value === 'string' && getUserAffiliations().includes(value))
  );
}
