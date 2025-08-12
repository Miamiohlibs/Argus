# Watson/Argus

## Next Steps

### Bugs

- handle what happens when there's only one item attached to a bib -- currently "Unknown" (no description); auto-add only item
- currently only retrieving first 10 holdings items for a bibEntry

### Features

- route / clear entry on submit
  - for now, just harsh page reload
  - later: implement onEntryAdded callback from page -> RecordSearchForm -> HoldingEntry
- add db field for total numbers of items available on a given record (denominator in : select 3/12 items)
  - for now: sorta set up but needs testing
- tools for entries display: linkout, edit
- editable projects and entries
- custom entries
- barcode and url lookups ( and maybe: unified lookup )
- handle lookups with weird urls like the Orwell Mystique:
  - https://ohiolink-mu.primo.exlibrisgroup.com/permalink/01OHIOLINK_MU/mjrtap/cdi_nii_cinii_1130282270339388288
- streamline actions/almaSearch.ts
- print slips
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
