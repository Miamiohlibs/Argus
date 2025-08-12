'use client';
import { TableColumn } from 'react-data-table-component';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Prisma } from '@prisma/client';
// import { User as ClerkUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
// import getProjects from '@/app/actions/getProjects';
// import getEntries from '@/app/actions/getEntries';
import DeleteProjectButton from './DeleteProjectButton';
import DeleteButton from './DeleteButton';
import deleteEntry from '@/app/actions/deleteEntry';
// import DeleteEntryButton from './DeleteEntryButton';
import { User } from '@prisma/client';
import { toast } from 'react-toastify';

// Use Prisma's generated type that includes the user relation
type EntryWithItems = Prisma.BibEntryGetPayload<{
  include: { items: true };
}>;

// Define the props interface
interface EntriesTableProps {
  entries?: EntryWithItems[];
}

export default function EntriesTable({ entries = [] }: EntriesTableProps) {
  const [currentEntries, setCurrentEntries] = useState<EntryWithItems[]>([]); // Track current entries
  const [filteredEntries, setFilteredEntries] = useState<EntryWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  const handleDelete = async (entryId: string) => {
    console.log(`Delete entry with ID: ${entryId}`);

    const { message, error } = await deleteEntry(entryId);
    if (error) {
      toast.error('Entry deletion failed');
    } else {
      toast.success('Entry deleted successfully');
      const updatedEntries = currentEntries.filter(
        (item) => item.id !== entryId
      );
      setCurrentEntries(updatedEntries);

      const updatedFilteredEntries = filteredEntries.filter(
        (item) => item.id != entryId
      );
      setFilteredEntries(updatedFilteredEntries);
    }
  };

  // Initialize data when entries prop changes
  useEffect(() => {
    setCurrentEntries(entries);
    setFilteredEntries(entries);
    setLoading(false);
  }, [entries]); // Only run when entries prop changes

  // Filter entries when filterText or currentEntries change
  useEffect(() => {
    const filtered = currentEntries.filter((entry) =>
      [entry.itemTitle, entry.author, entry.notes].some((val) =>
        val?.toLowerCase().includes(filterText.toLowerCase() || '')
      )
    );
    setFilteredEntries(filtered);
  }, [filterText, currentEntries]); // Use currentEntries instead of entries

  // Move columns inside the component so handleDelete is in scope
  const columns: TableColumn<EntryWithItems>[] = [
    {
      name: 'Title',
      selector: (row: EntryWithItems) => row.itemTitle ?? '',
      cell: (row: EntryWithItems) => (
        <Link href={`/entry/${row.id}`}>
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
      selector: (row: EntryWithItems) => row.location ?? 'Unknown',
      sortable: true,
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
    },
    {
      name: 'Notes',
      selector: (row: EntryWithItems) => row.notes ?? '',
      sortable: false,
    },
    {
      name: 'Tools',
      cell: (row: EntryWithItems) => {
        // Check if current user can edit this project
        let canEdit = true;
        // const canEdit =
        //   user?.role === 'admin' ||
        //   user?.role === 'superadmin' ||
        //   row.user.clerkUserId === user?.clerkUserId;
        // console.log(
        //   'Row User:',
        //   row.user?.clerkUserId,
        //   'Current User:',
        //   user?.clerkUserId,
        //   'Can edit:',
        //   canEdit,
        //   'for project:',
        //   row.title
        // );
        if (!canEdit) {
          return <></>;
        }
        return (
          <>
            <Link href={`#`}>
              <Button variant="outline-primary" size="sm" className="me-1">
                Edit
              </Button>
            </Link>
            <DeleteButton label="entry" onDelete={() => handleDelete(row.id)} />
          </>
        );
      },
      ignoreRowClick: true,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={filteredEntries}
      progressPending={loading}
      pagination
      highlightOnHover
      striped
      subHeader
      subHeaderComponent={
        <input
          type="text"
          placeholder="Search projects..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
      }
    />
  );
}
