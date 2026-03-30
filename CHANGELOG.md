# Changelog

## 0.8.1 - 2026-03-30

# Fixed

- Fix missing data on pull slips. (In move from 0.7.x to 0.8.0, some data was not displayed.)
- Improved pull slip printing fit to page: shrink to fit page better across different OS/browser/etc; eliminate new-page CSS after last page (on some systems there is still sometimes a blank page after printing, but only sometimes now.)
- If a project has no entries, return a graceful error message instead of a bare Next.js error when attempting to print slips.

# Changed

- Add override in package.json to bump npm package "effect" to ^3.20.0 for security.

## 0.8.0 - 2026-03-13

## Fixed

- Fixed color contrast on footer links for accessibility.

## Added

- Added "reassignAll" feature on the admin/users page -- reassign ownership of all of a user's projects to another user. Useful when someone leaves the organization.
- Added `/me` route with useful info about the logged-in user for diagnostic purposes.
- Added [Zod](https://zod.dev/) dependency for type enforcement (not used widely yet -- we may want to update some older clunkier mechanisms to use it.)
- Added missing "Back to Project" button on "reassignProject" page.
- Added explanations of user roles in UserEditForm.

## Changed

- Replaced PDF output for slips and quick slips with more accessible, semantic, formatted HTML/CSS pages.
- Removed the confusing `isOwnerish` permission; it was the equivalent of `isOwner || isAdmin`; we'll use that clearer code from now on.
- Removed unused or redundant Typescript types; use native Prisma-derived types where possible.
- Updated Clerk to [Clerk Core 3](https://clerk.com/docs/guides/development/upgrading/upgrade-guides/core-3)

## 0.7.2 - 2026-02-13

### Added

- add .env variables:
  - NEXT_PUBLIC_CONTACT_DEPT
  - NEXT_PUBLIC_CONTACT_EMAIL
  - NEXT_PUBLIC_CONTACT_PHONE
- create About page, add link in footer; uses new .env variables to include local contact info if available
- add About info to Guest (unlogged in) page

### Changed

- more accessible/semantic layout for footer
- use Bootstrap styling on login buttons

## 0.7.1 - 2026-02-09

### Fixed

- Fixed permission for editing a project: works for project owners, co-editors, admins; no longer showing the edit option to users who lack the permissions to execute the actions.
- Fixed margins on buttons in All Projects and Public Projects pages.

### Added

- Added MIT license for open source release.
- Added detailed configuration steps in README.

### Changed

- Updated layout of search results to include project updated and created dates.
- Updated footer to include link to GitHub repo.
- Added search icon next to "Search" in the header.

## 0.7.0 - 2026-01-28

### Fixed

- Fixed bug that lost track of which Alma items were selected on an bibEntry under some circumstances
- When a project is archived or deleted, it now disappears from the page instead of showing as disabled.

### Added

- Projects can be made public; by default they are private. public projects are visible to all users regardess of role or ownership.
- Search feature: search entries across all projects available to a user (for regular users, this includes public projects, their own projects, and projects for which they are a co-editor; for admin users, this includes all non-deleted projects)
- Projects may be deleted or archived; the archives are viewable.
- Pull slips can be printed individually for an entry in entries list for a project.
- Admin-only feature: create a pull slip for an individual bib record without creating a project for it.
- Admin-only feature: reassign a project to a different user's ownership.
- New environment variable NEXT_PUBLIC_PROJECT_PURPOSES defines array of project "purpose" options displayed on pull slips -- takes a stringified JSON object from an array of type string[].
- New environment variable NEXT_PUBLIC_SUBJECT_LIST defines array of subjects that can be applied to a project -- takes a stringified JSON object from an array of type string[].
- Adds four new project variables: purpose, subject, public (boolean), status (status allows for an "archived" project).

### Changed

- Reorganized pull slip layout.
- Added created/updated dates in Users table (admin feature).

## 0.6.3 - 2026-01-12

- Updated next, react, react-dom packages to correct build errors.

## 0.6.2 - 2025-12-05

- Updated next, react, react-dom packages to security patched versions.

## 0.6.1 - 2025-10-27

### Fixed

- In ProjectsTable, projects now filterable by owner's name.

### Changed

- On Print Slips page, PDF is now wrapped in main layout, includes project buttons.
- Changed the "Go" button to "Record" in EntriesTable.

## 0.6.0 - 2025-10-17

### Fixed

- Accessibility fixes:
  - Adds aria-busy, aria-live, aria-atomic attributes on bulkAdd page.
- Cascade deletion of BibEntry to also delete any associated ItemEntry in database.
- Fix sorting of dates in tables to be based on date, not on teh string format.

### Added

- Added option of having co-editors on a project with permissions to add and remove entries.
- Show loading status of Alma lookup in RecordSearchForm.
- Added "Print Slips permissions" (true/false) for users.
- Allow Admin to change user's display name in Users page.
- In Custom Entry Form, select item location from a list instead of free-form (uses data from NEXT_PUBLIC_LOCATION_CODES_JSON in .env).
- Added more meaningful page titles in html headers using NextJs's generateMetadata functio.n
- Added .env configurations:
  - SHADOW_DATABASE_URL
  - NEXT_PUBLIC_LOCATION_CODES_JSON

### Changed

- Permissions structure -- `lib/getUserInfo.ts` returns a bunch of boolean permissions (isBasicUser, isEditorOrAbove, isAdmin, isSuperAdmin, canPrint, canEdit, isOwner, isCoEditor, isOwnerish, nonOwnerEditor).
- Improved print layout of html pages.
- Made the display of ProjectMetadata and ProjectButtons more consistent across views.

## 0.5.3 - 2025-09-22

### Fixed

- Fixed ProjectsTable layout that was overflowing past viewport.
- Fixed security bug: now admins cannot create superadmins.

## 0.5.2 - 2025-09-18

### Added

- Added project name and owner to all project pages.
- Added aria-live setting on RecordSearchForm results.

### Changed

- Increased defaults on number of rows in dataTables from 10 to 25.
- Use unauthorized() instead of returning "unauthorized" as text response where relevant.
- Use SCSS to override some bootstrap defaults for better accessiblity.

### Fixed

- Fixed broken and added missing Form.Label components on all forms.
- Fixed some bad focus indicators.
- Took all instances of a <Link> wrapped around at <Button> and used <Link className="btn"> instead.

## 0.5.1 - 2025-09-11

### Added

- Added skip-link to main layout.
- Added some basic documentation.

### Changed

- Moved all project-related buttons to the ProjectButtons link -- shows more buttons in more places (e.g. links to the Alma-add page from the Custom-add page).
- Hide JSON output from view except when new .env NEXT_PUBLIC_IS_DEV_ENV=true
- Changed name to Argus (was: Watson-Argus).

### Fixed

- Fixed bug preventing bibData.location_names from being saved in addEntry action.
- Added aria-labels on data-tables.
- Usability fixes: fixed some contrast and focus issues.
- Embiggened some too-small fonts in data-table.
- Start every page with h1.
- Fixed layout of user.name in header.

## 0.5.0 - 2025-09-10

### Added

- Adds bulk-add feature.
- Adds option to display different colors and/or logo text in header (used for visually distinguishing between dev, test, and prod environments). uses new .env variables: NEXT_PUBLIC_NAV_COLOR, NEXT_PUBLIC_NAV_LABEL
- Adds a "duplicate list" feature to copy a list from another user (or your own).

### Changed

- Bumps "next" to 15.5.2.
- Admins can delete any project.
- Print two slips per page instead of one.
- Project "Updated" date will be updated on changes to list contents (add/delete/edit BibEntry or ItemEntry), not only when the project entry itself is updated.
- Moved getProject, getProjects, deleteProject actions to projectActions file.

### Fixed

- Fixed footer placement.
- Fixed bugs incorrectly showing nonOwnerAlert to admin's using the editEntry or customEntry edit features.

## 0.4.0 - 2025-09-05

### Added

- Added location names (e.g. "Periodicals") in addition to location codes (e.g. "specp").
- One unified searchbox searches by call number, barcode, mms_id, or permalink URL. NOTE: permalink URL must contain an MMS_ID to work; if it doesn't, you'll probably need to use the barcode or call_number.
- Added option to create a custom entry.
- Display warning banner for admins when changing someone else's content.
- Added page footer with version info.
- Added CHANGELOG.

### Changed

- Changed pull slips from one per bibEntry to one per item (potentially several items per bibEntry).
- Fixed bug that prevents admins from adding to someone else's list.
- Updated pull slip format.
- Update logo.
