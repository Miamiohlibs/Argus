'use client';
import { TableColumn } from 'react-data-table-component';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import DeleteButton from './DeleteButton';
import deleteEntry from '@/app/actions/deleteEntry';
import { toast } from 'react-toastify';
import { EntryWithItems } from '@/types/EntryWithItems';
import { User } from '@prisma/client';

// Define the props interface
interface EntriesTableProps {
  entries?: EntryWithItems[];
  user: User;
  ownerClerkId: string;
}

export default function EntriesTable({
  entries = [],
  user,
  ownerClerkId,
}: EntriesTableProps) {
  const [currentEntries, setCurrentEntries] = useState<EntryWithItems[]>([]); // Track current entries
  const [filteredEntries, setFilteredEntries] = useState<EntryWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  const handleDelete = async (entryId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this entry?'
    );
    if (!confirmed) return;

    console.log(`Delete entry with ID: ${entryId}`);

    const { error } = await deleteEntry(entryId); // also gets {message}
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
        <Link href={`/editEntry/${row.id}`}>
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
        // const canEdit = true;
        const canEdit =
          user !== null &&
          user !== undefined &&
          (user?.role === 'admin' ||
            user?.role === 'superadmin' ||
            ownerClerkId === user?.clerkUserId);
        // console.log(
        //   'Row User:',
        //   ownerClerkId,
        //   'Current User:',
        //   user?.clerkUserId,
        //   'Can edit:',
        //   canEdit,
        //   'for project:',
        //   row.itemTitle
        // );
        const LinkOutUrl = row.url ?? undefined;
        const LinkOut = LinkOutUrl ? (
          <Link href={LinkOutUrl} target="_blank">
            <Button variant="outline-info" size="sm" className="me-1">
              Go
            </Button>
          </Link>
        ) : undefined;
        if (!canEdit) {
          return <>{LinkOut}</>;
        }
        return (
          <>
            {LinkOut}
            <Link href={`/editEntry/${row.id}`}>
              <Button variant="outline-primary" size="sm" className="me-1">
                Edit
              </Button>
            </Link>
            <DeleteButton label="" onDelete={() => handleDelete(row.id)} />
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
