# Argus

Argus is a pull-slip manager for special collections. Library staff and researchers can create lists of bibliographic (bib) records from a connected Ex Libris Alma/Primo catalog to look up items by call number, barcode, or Alma's mms_id. Item records (for individual volumes) associate with each bib record can also be specified. Once lists are created, a user can generate pull slips for use in special collections.

User-created lists can be used to help researchers remember items of interest, and can help library workers easily re-use or update course-related items from one class/semester/year to the next, streamlining workflows and reducing duplicated effort.

## Architecture

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

It uses Google-based authentication, managed through [Clerk](https://clerk.com/). User permissions are managed by the application.

Databases are managed through Prisma on a hosted database.

Connects with Ex Libris's Alma API; to allow call-number lookups, the Ex Libris Primo API is required as well.

## Configuration

Set up a `.env` file, including:

```
NEXT_PUBLIC_APP_BASEPATH=/argus. # or whatever path you want to use; skip this to use /
DATABASE_URL=postgresql://... #database connection string; I use Neon
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
ALMA_BASEURL=https://api-na.hosted.exlibrisgroup.com #or whichever server is best for you
ALMA_API_KEY= #your alma api key
ALMA_PERMALINK_BASEURL= # your local alma permalink base url, e.g. https://ohiolink-mu.primo.exlibrisgroup.com/permalink/01OHIOLINK_MU/i4qs0/alma
NEXT_PUBLIC_BARCODE_PREFIX=12345
NEXT_PUBLIC_INST_CODE=4321
NEXT_PUBLIC_USE_PRIMO=true
PRIMO_QUERYSTRING=tab=Everything&scope=MyInst_and_CI&vid=01OHIOLINK_MU:MU #use your scope and vid
PRIMO_API_KEY=
NEXT_PUBLIC_NAV_COLOR=primary #suggested: primary, dark, success (bootstrap theme colors suitable for light text)
NEXT_PUBLIC_NAV_LABEL= This text will be appended to the Argus logo text
PORT=3333 # or whatever port you want to use
NODE_ENV=development #or production -- note: production required to 'npm run build'; doesn't build under developement
```

Optionally include minimum level of logging:

```
LOG_LEVEL=info #info is the default, choose from: error,warn,info,verbose,debug,silly
```

## Getting Started (Boilerplate NextJs stuff)

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
