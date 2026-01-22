import { UserAffiliation, UserStatus } from '@prisma/client';

// this should maybe be reorganized as regular components
// the "none" variable on the blankPullDownOption doesn't work twice on the same page
// needs to take a varialbe so the name is like "none-affil", "none-role", etc.

const validStatuses = Object.values(UserStatus);
const validAffiliations = Object.values(UserAffiliation);
// did't include the role selector here because it changes if the user is superadmin or not

export const statusOptions: React.JSX.Element[] = validStatuses.map((r) => (
  <option key={r} value={r}>
    {r.charAt(0).toUpperCase() + r.slice(1)}
  </option>
));

export const affiliationOptions: React.JSX.Element[] = validAffiliations.map(
  (r) => (
    <option key={r} value={r}>
      {r.charAt(0).toUpperCase() + r.slice(1)}
    </option>
  )
);

export const blankPullDownOption: React.JSX.Element = (
  <option key="none" value="">
    None
  </option>
);
