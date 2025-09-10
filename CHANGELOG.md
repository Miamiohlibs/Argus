# Changelog

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
