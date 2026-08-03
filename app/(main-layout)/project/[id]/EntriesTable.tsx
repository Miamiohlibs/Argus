'use client';
import { TableColumn, TableProps } from 'react-data-table-component';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import deleteEntry from '@/app/actions/deleteEntry';
import { toast } from 'react-toastify';
import { EntryWithItems } from '@/types/EntryWithItems';
import Button, { buttonClasses } from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { CheckCircle as Check } from 'react-bootstrap-icons';
import Form from 'next/form';

// import { User } from '@prisma/client';

// react-data-table-component's built-in pagination bar reads
// window.innerWidth during render to pick a responsive layout, which never
// matches the server-rendered markup -- load it client-only to avoid that.
const DataTable = dynamic<TableProps<EntryWithItems>>(
  () => import('react-data-table-component'),
  { ssr: false },
);

// Define the props interface
interface EntriesTableProps {
  entries?: EntryWithItems[];
  canEdit?: boolean;
  canPrint?: boolean;
  handleSelectSubmit: (selectedIds: string[]) => void;
}

export default function EntriesTable({
  entries = [],
  canEdit = false,
  canPrint = false,
  handleSelectSubmit,
}: EntriesTableProps) {
  const [currentEntries, setCurrentEntries] = useState(entries); // Track current entries
  const [prevEntries, setPrevEntries] = useState(entries);
  const [filterText, setFilterText] = useState('');

  // Reset local entries when the entries prop changes (e.g. navigating to a different project)
  if (entries !== prevEntries) {
    setPrevEntries(entries);
    setCurrentEntries(entries);
  }

  const filteredEntries = useMemo(
    () =>
      currentEntries.filter((entry) =>
        [entry.itemTitle, entry.author, entry.notes].some((val) =>
          val?.toLowerCase().includes(filterText.toLowerCase() || ''),
        ),
      ),
    [currentEntries, filterText],
  );

  const handleDelete = async ({
    entryId,
    projectId,
  }: {
    entryId: string;
    projectId: string;
  }) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this entry?',
    );
    if (!confirmed) return;

    console.debug(`Delete entry with ID: ${entryId}`);

    const { error } = await deleteEntry({ entryId, projectId }); // also gets {message}
    if (error) {
      toast.error(`Entry deletion failed: ${error}`);
    } else {
      toast.success('Entry deleted successfully');
      setCurrentEntries((prev) => prev.filter((item) => item.id !== entryId));
    }
  };

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleItemCheck = (item: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, item]);
    } else {
      setSelectedItems((prev) =>
        prev.filter((selectedItem) => selectedItem !== item),
      );
    }
  };

  // Move columns inside the component so handleDelete is in scope
  const columns: TableColumn<EntryWithItems>[] = [
    {
      name: <Check></Check>,
      sortable: false,
      width: '2.5em',
      wrap: false,
      cell: (row) => (
        <Checkbox
          name="selectEntry[]"
          value={row.id}
          label=""
          onChange={(e) => handleItemCheck(row.id, e.target.checked)}
        ></Checkbox>
      ),
    },
    {
      name: 'Title',
      selector: (row: EntryWithItems) => row.itemTitle ?? '',
      cell: (row: EntryWithItems) => (
        <Link
          href={
            // if no external url, then it's a custom entry -- use the link for that format
            row.url == undefined
              ? `/customEntry/${row.projectId}/${row.id}`
              : `/editEntry/${row.id}`
          }
        >
          {row.itemTitle || 'Untitled Project'}
        </Link>
      ),
      sortable: true,
    },
    {
      name: 'Author',
      selector: (row: EntryWithItems) => row.author ?? 'Unknown',
      sortable: true,
    },
    {
      name: 'Location',
      selector: (row: EntryWithItems) => {
        if (row.location_codes || row.location_display) {
          return `${row.location_display} ${row.location_codes}`.trim();
        } else {
          return `Unknown`;
        }
      },
      cell: (row: EntryWithItems) => {
        if (row.location_codes || row.location_display) {
          return (
            <>
              {row.location_display && <>{row.location_display}</>}
              {row.location_codes && (
                <>
                  <br />({row.location_codes})
                </>
              )}
            </>
          );
        } else {
          return <>Unknown</>;
        }
      },
      sortable: true,
      width: '10em',
    },
    {
      name: 'Call Number',
      selector: (row: EntryWithItems) => row.callNumber ?? '',
      sortable: true,
    },
    {
      name: '# Items',
      selector: (row: EntryWithItems) => row.items.length ?? '',
      sortable: true,
      cell: (row: EntryWithItems) => {
        if (row.totalItems === 1) {
          return 1;
        } else if (row.totalItems && row.items.length > 0) {
          return `${row.items.length} / ${row.totalItems}`;
        } else if (row.items.length > 0) {
          return row.items.length;
        } else {
          return '';
        }
      },
      width: '7em',
    },
    {
      name: 'Notes',
      selector: (row: EntryWithItems) => row.notes ?? '',
      sortable: false,
      width: '12em',
    },
    {
      name: 'Tools',
      cell: (row: EntryWithItems) => {
        const LinkOutUrl = row.url ?? undefined;
        const LinkOut = LinkOutUrl ? (
          <Link
            href={LinkOutUrl}
            target="_blank"
            className={buttonClasses({
              variant: 'outline-info',
              size: 'sm',
              className: 'me-1',
            })}
          >
            Record
          </Link>
        ) : undefined;
        if (!canEdit) {
          return <>{LinkOut}</>;
        }
        return (
          <>
            {LinkOut}
            <Link
              href={
                // if no external url, then it's a custom entry -- use the link for that format
                row.url == undefined
                  ? `/customEntry/${row.projectId}/${row.id}`
                  : `/editEntry/${row.id}`
              }
              className={buttonClasses({
                variant: 'outline-primary',
                size: 'sm',
                className: 'me-1',
              })}
            >
              Edit
            </Link>
            {canPrint && (
              <Link
                href={`/slips/${row.projectId}--${row.id}`}
                className={buttonClasses({
                  variant: 'outline-primary',
                  size: 'sm',
                  className: 'me-1',
                })}
              >
                Print
              </Link>
            )}
            <DeleteButton
              label=""
              onDelete={() =>
                handleDelete({
                  entryId: row.id,
                  projectId: row.projectId.toString(),
                })
              }
            />
          </>
        );
      },
      ignoreRowClick: true,
    },
  ];

  return (
    <>
      <div className="react-data-table" id="entries-table">
        <Form action={() => handleSelectSubmit(selectedItems)}>
          {selectedItems.length > 0 && (
            <Button type="submit" variant="outline-primary" size="sm">
              Print Selected Items <Check />
            </Button>
          )}
          <DataTable
            columns={columns}
            data={filteredEntries}
            pagination
            paginationPerPage={25}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            highlightOnHover
            striped
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search entries..."
                aria-label="Search entries"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="p-2 border rounded w-full md:w-1/3"
              />
            }
          />
        </Form>
      </div>
    </>
  );
}
