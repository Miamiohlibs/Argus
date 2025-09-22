# Changelog

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
