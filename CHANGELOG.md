# Changelog

## 0.6.3 - 2026-01-12

- updated next, react, react-dom packages to correct build errors

## 0.6.2 - 2025-12-05

- updated next, react, react-dom packages to security patched versions

## 0.6.1 - 2025-10-27

### Fixed

- in ProjectsTable, projects now filterable by owner's name

### Changed

- on Print Slips page, PDF is now wrapped in main layout, includes project buttons
- changed the "Go" button to "Record" in EntriesTable

## 0.6.0 - 2025-10-17

### Fixed

- Accessibility fixes:
  - adds aria-busy, aria-live, aria-atomic attributes on bulkAdd page
- Cascade deletion of BibEntry to also delete any associated ItemEntry in database
- Fix sorting of dates in tables to be based on date, not on teh string format

### Added

- Added option of having co-editors on a project with permissions to add and remove entries
- Show loading status of Alma lookup in RecordSearchForm
- Added "Print Slips permissions" (true/false) for users
- Allow Admin to change user's display name in Users page
- In Custom Entry Form, select item location from a list instead of free-form (uses data from NEXT_PUBLIC_LOCATION_CODES_JSON in .env)
- Added more meaningful page titles in html headers using NextJs's generateMetadata function
- Added .env configurations:
  - SHADOW_DATABASE_URL
  - NEXT_PUBLIC_LOCATION_CODES_JSON

### Changed

- Permissions structure -- `lib/getUserInfo.ts` returns a bunch of boolean permissions (isBasicUser, isEditorOrAbove, isAdmin, isSuperAdmin, canPrint, canEdit, isOwner, isCoEditor, isOwnerish, nonOwnerEditor)
- Improved print layout of html pages
- Made the display of ProjectMetadata and ProjectButtons more consistent across views

## 0.5.3 - 2025-09-22

### Fixed

- fixed ProjectsTable layout that was overflowing past viewport
- fixed security bug: now admins cannot create superadmins

## 0.5.2 - 2025-09-18

### Added

- added project name and owner to all project pages
- added aria-live setting on RecordSearchForm results

### Changed

- increased defaults on number of rows in dataTables from 10 to 25
- use unauthorized() instead of returning "unauthorized" as text response where relevant
- use SCSS to override some bootstrap defaults for better accessiblity

### Fixed

- fixed broken and added missing Form.Label components on all forms
- fixed some bad focus indicators
- took all instances of a <Link> wrapped around at <Button> and used <Link className="btn"> instead

## 0.5.1 - 2025-09-11

### Added

- added skip-link to main layout
- added some basic documentation

### Changed

- moved all project-related buttons to the ProjectButtons link -- shows more buttons in more places (e.g. links to the Alma-add page from the Custom-add page)
- hide JSON output from view except when new .env NEXT_PUBLIC_IS_DEV_ENV=true
- changed name to Argus (was: Watson-Argus)

### Fixed

- fixed bug preventing bibData.location_names from being saved in addEntry action
- added aria-labels on data-tables
- usability fixes: fixed some contrast and focus issues
- embiggened some too-small fonts in data-table
- start every page with h1
- fixed layout of user.name in header

## 0.5.0 - 2025-09-10

### Added

- adds bulk-add feature
- adds option to display different colors and/or logo text in header (used for visually distinguishing between dev, test, and prod environments). uses new .env variables: NEXT_PUBLIC_NAV_COLOR, NEXT_PUBLIC_NAV_LABEL
- adds a "duplicate list" feature to copy a list from another user (or your own)

### Changed

- bumps "next" to 15.5.2
- admins can delete any project
- print two slips per page instead of one
- project "Updated" date will be updated on changes to list contents (add/delete/edit BibEntry or ItemEntry), not only when the project entry itself is updated
- moved getProject, getProjects, deleteProject actions to projectActions file

### Fixed

- fixes footer placement
- fixed bugs incorrectly showing nonOwnerAlert to admin's using the editEntry or customEntry edit features

## 0.4.0 - 2025-09-05

### Added

- added location names (e.g. "Periodicals") in addition to location codes (e.g. "specp")
- one unified searchbox searches by call number, barcode, mms_id, or permalink URL. NOTE: permalink URL must contain an MMS_ID to work; if it doesn't, you'll probably need to use the barcode or call_number.
- added option to create a custom entry
- display warning banner for admins when changing someone else's content
- added page footer with version info
- added CHANGELOG

### Changed

- changed pull slips from one per bibEntry to one per item (potentially several items per bibEntry)
- fixed bug that prevents admins from adding to someone else's list
- updated pull slip format
- update logo
