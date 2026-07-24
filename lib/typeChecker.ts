import { getUserAffiliations, getUserStatuses } from '@/lib/utils';

export function isAllowedStatus(
  value: string | string[] | undefined,
): value is string | undefined {
  return (
    value === undefined ||
    (typeof value === 'string' && getUserStatuses().includes(value))
  );
}

export function isAllowedAffiliation(
  value: string | string[] | undefined,
): value is string | undefined {
  return (
    value === undefined ||
    (typeof value === 'string' && getUserAffiliations().includes(value))
  );
}
