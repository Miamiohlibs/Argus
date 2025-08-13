# Watson/Argus

## Next Steps

### Build errors:

./app/printSlips/[id]/page.tsx
10:6 Warning: 'EntriesResult' is defined but never used. @typescript-eslint/no-unused-vars

./app/searchBibs/ClientSearchBibsPage.tsx
17:9 Warning: 'otherParam' is assigned a value but never used. @typescript-eslint/no-unused-vars

./components/AddProject.tsx
19:13 Warning: 'data' is assigned a value but never used. @typescript-eslint/no-unused-vars

./components/AddTransaction.tsx
10:13 Warning: 'data' is assigned a value but never used. @typescript-eslint/no-unused-vars

./components/BibEntry.tsx
10:18 Error: Unexpected any. Specify a different type. @typescript-eslint/no-explicit-any
16:3 Warning: 'projectId' is defined but never used. @typescript-eslint/no-unused-vars
30:7 Error: 'returnValue' is never reassigned. Use 'const' instead. prefer-const

./components/DeleteButton.tsx
19:14 Warning: 'err' is defined but never used. @typescript-eslint/no-unused-vars

./components/DeleteProjectButton.tsx
8:10 Warning: 'on' is defined but never used. @typescript-eslint/no-unused-vars

./components/EntriesTable.tsx
26:13 Warning: 'message' is assigned a value but never used. @typescript-eslint/no-unused-vars
112:13 Error: 'canEdit' is never reassigned. Use 'const' instead. prefer-const

./components/FloatingSelectField.tsx
15:22 Error: The `{}` ("empty object") type allows any non-nullish value, including literals like `0` and `""`.

- If that's what you want, disable this lint rule with an inline comment or configure the 'allowObjectTypes' rule option.
- If you want a type meaning "any object", you probably want `object` instead.
- If you want a type meaning "any value", you probably want `unknown` instead. @typescript-eslint/no-empty-object-type

./components/Header.tsx
4:3 Warning: 'SignUpButton' is defined but never used. @typescript-eslint/no-unused-vars

./components/HoldingEntry.tsx
9:13 Error: Unexpected any. Specify a different type. @typescript-eslint/no-explicit-any
16:3 Warning: 'onEntryAdded' is defined but never used. @typescript-eslint/no-unused-vars
18:54 Error: Unexpected any. Specify a different type. @typescript-eslint/no-explicit-any
21:34 Error: Unexpected any. Specify a different type. @typescript-eslint/no-explicit-any
65:33 Error: Unexpected any. Specify a different type. @typescript-eslint/no-explicit-any
173:53 Error: Unexpected any. Specify a different type. @typescript-eslint/no-explicit-any

./components/RecordSearchForm.tsx
17:9 Warning: 'router' is assigned a value but never used. @typescript-eslint/no-unused-vars
18:42 Error: Unexpected any. Specify a different type. @typescript-eslint/no-explicit-any
21:9 Error: 'mms_id' is never reassigned. Use 'const' instead. prefer-const
37:9 Warning: 'handleBarcodeSearch' is assigned a value but never used. @typescript-eslint/no-unused-vars
38:9 Error: 'barcode' is never reassigned. Use 'const' instead. prefer-const

./components/SlipsList.tsx
1:10 Warning: 'EntryWithItems' is defined but never used. @typescript-eslint/no-unused-vars
7:11 Warning: 'project' is assigned a value but never used. @typescript-eslint/no-unused-vars
7:20 Warning: 'error' is assigned a value but never used. @typescript-eslint/no-unused-vars

./components/UserEditForm.tsx
15:10 Warning: 'revalidatePath' is defined but never used. @typescript-eslint/no-unused-vars
26:9 Error: 'updatedUser' is never reassigned. Use 'const' instead. prefer-const

./components/UserList.tsx
2:10 Warning: 'User' is defined but never used. @typescript-eslint/no-unused-vars
6:18 Warning: 'error' is assigned a value but never used. @typescript-eslint/no-unused-vars

info - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules

### Bugs

- handle what happens when there's only one item attached to a bib -- currently "Unknown" (no description); auto-add only item
- currently only retrieving first 10 holdings items for a bibEntry
- need to restrict who can delete an entry
- use generic delete button for deleteProject
- clerk middleware error in header: at async Header (components/Header.tsx:13:15)
  3 |
  4 | export const checkUser = async () => {
  > 5 | const user = await currentUser();

### Features

- route / clear entry on submit
  - for now, just harsh page reload
  - later: implement onEntryAdded callback from page -> RecordSearchForm -> HoldingEntry
- add db field for total numbers of items available on a given record (denominator in : select 3/12 items)
  - for now: sorta set up but needs testing
- editable projects and entries
- custom entries
- barcode and url lookups ( and maybe: unified lookup )
- handle lookups with weird urls like the Orwell Mystique:
  - https://ohiolink-mu.primo.exlibrisgroup.com/permalink/01OHIOLINK_MU/mjrtap/cdi_nii_cinii_1130282270339388288
- streamline actions/almaSearch.ts
- print slips
  - for now: bare bones slips implemented
  - display options: pdf-creator-node, @react-pdf/layout
- organize actions and/or components?

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
